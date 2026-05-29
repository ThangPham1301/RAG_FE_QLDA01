import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { NotificationsAPI } from '../api/client'
import { refreshToken as refreshAccessToken } from '../services/authService'
import { getAccessToken } from '../utils/auth'
import { useAuth } from './AuthContext'

const RealtimeContext = createContext()

const eventTargets = {
  'team.invitation.created': 'realtime:team',
  'team.invitation.updated': 'realtime:team',
  'team.invitation.responded': 'realtime:team',
  'team.membership.created': 'realtime:team',
  'team.document.created': 'realtime:team',
  'team.document.status': 'realtime:document',
  'document.status': 'realtime:document',
  'document.shared': 'realtime:library',
  'chat.document.attached': 'realtime:chat',
  'evaluation.created': 'realtime:evaluation',
  'evaluation.updated': 'realtime:evaluation',
  'evaluation.pinned': 'realtime:evaluation',
  'evaluation.unpinned': 'realtime:evaluation',
}

const buildWebSocketUrl = () => {
  const apiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
  const base = apiBase.replace(/\/api\/?$/, '').replace(/\/$/, '')
  const wsBase = base.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:')
  const token = encodeURIComponent(getAccessToken() || '')
  return `${wsBase}/ws/realtime/?token=${token}`
}

export const RealtimeProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [connected, setConnected] = useState(false)
  const socketRef = useRef(null)
  const retryRef = useRef(null)

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.is_read).length,
    [notifications]
  )

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return
    try {
      const response = await NotificationsAPI.list()
      setNotifications(response.data.results || response.data || [])
    } catch (error) {
      console.error('[Realtime] load notifications failed:', error)
    }
  }, [isAuthenticated])

  const dispatchRealtimeEvent = useCallback((type, payload) => {
    const eventName = eventTargets[type]
    if (eventName) {
      window.dispatchEvent(new CustomEvent(eventName, { detail: { type, payload } }))
    }
  }, [])

  useEffect(() => {
    loadNotifications()
  }, [loadNotifications])

  useEffect(() => {
    if (!isAuthenticated || !user || !getAccessToken()) return undefined

    let cancelled = false

    const connect = async () => {
      if (cancelled) return
      try {
        await refreshAccessToken()
      } catch (error) {
        console.warn('[Realtime] token refresh before websocket failed:', error)
      }
      if (cancelled || !getAccessToken()) return

      const socket = new WebSocket(buildWebSocketUrl())
      socketRef.current = socket

      socket.onopen = () => {
        setConnected(true)
      }

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          const { type, payload = {} } = data

          if (type === 'notification.created') {
            setNotifications((current) => [payload, ...current.filter((item) => item.id !== payload.id)])
          } else if (type === 'notification.updated') {
            setNotifications((current) => current.map((item) => (
              item.id === payload.id ? { ...item, ...payload } : item
            )))
          }

          dispatchRealtimeEvent(type, payload)
        } catch (error) {
          console.error('[Realtime] invalid message:', error)
        }
      }

      socket.onclose = () => {
        setConnected(false)
        if (!cancelled) {
          retryRef.current = setTimeout(connect, 2500)
        }
      }

      socket.onerror = () => {
        socket.close()
      }
    }

    connect()

    return () => {
      cancelled = true
      if (retryRef.current) clearTimeout(retryRef.current)
      if (socketRef.current) socketRef.current.close()
      setConnected(false)
    }
  }, [dispatchRealtimeEvent, isAuthenticated, user])

  const markNotificationRead = async (id) => {
    await NotificationsAPI.markRead(id)
    setNotifications((current) => current.map((item) => (
      item.id === id ? { ...item, is_read: true } : item
    )))
  }

  return (
    <RealtimeContext.Provider value={{ connected, notifications, unreadCount, loadNotifications, markNotificationRead }}>
      {children}
    </RealtimeContext.Provider>
  )
}

export const useRealtime = () => {
  const context = useContext(RealtimeContext)
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider')
  }
  return context
}
