import { createContext, useCallback, useContext, useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getCurrentUser, logout as logoutAPI } from '../services/authService'
import { AUTH_LOGOUT_EVENT, getStoredUser, getAccessToken, clearAuth } from '../utils/auth'

const AuthContext = createContext()
const AUTH_ROUTES = new Set(['/login', '/register', '/forgot-password', '/verify-email'])
const SESSION_CHECK_INTERVAL_MS = 10000

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const isAuthRoute = AUTH_ROUTES.has(location.pathname)

  const finishLocalLogout = useCallback(() => {
    clearAuth()
    setUser(null)
    setError(null)

    if (!isAuthRoute) {
      navigate('/login', { replace: true })
    }
  }, [isAuthRoute, navigate])

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = getAccessToken()
        const storedUser = getStoredUser()

        if (token && storedUser) {
          // Try to verify with backend
          try {
            const userData = await getCurrentUser()
            setUser(userData)
          } catch {
            // Token invalid, clear auth
            finishLocalLogout()
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('Auth init error:', err)
        setError(err.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [finishLocalLogout])

  useEffect(() => {
    const handleAuthLogout = () => {
      finishLocalLogout()
    }

    const handleStorageChange = (event) => {
      const authKeys = new Set(['accessToken', 'refreshToken', 'user'])
      if (event.storageArea === localStorage && authKeys.has(event.key) && event.newValue === null) {
        finishLocalLogout()
      }
    }

    window.addEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout)
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener(AUTH_LOGOUT_EVENT, handleAuthLogout)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [finishLocalLogout])

  useEffect(() => {
    if (loading || isAuthRoute || !getAccessToken()) {
      return undefined
    }

    let cancelled = false

    const verifySession = async () => {
      if (!getAccessToken()) {
        finishLocalLogout()
        return
      }

      try {
        const userData = await getCurrentUser()
        if (!cancelled) {
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        }
      } catch (err) {
        const status = err.response?.status
        if (!cancelled && (!getAccessToken() || status === 401 || status === 403)) {
          finishLocalLogout()
        }
      }
    }

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        verifySession()
      }
    }

    const intervalId = window.setInterval(verifySession, SESSION_CHECK_INTERVAL_MS)
    window.addEventListener('focus', verifySession)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      cancelled = true
      window.clearInterval(intervalId)
      window.removeEventListener('focus', verifySession)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [finishLocalLogout, isAuthRoute, loading])

  const login = (userData, tokens) => {
    console.log('🔐 [AuthContext] login() called with:', {
      user: userData,
      tokens: tokens ? { access: tokens.access?.substring(0, 20) + '...', refresh: tokens.refresh?.substring(0, 20) + '...' } : null,
    })

    setUser(userData)
    console.log('✅ [AuthContext] setUser() called')

    if (tokens) {
      localStorage.setItem('accessToken', tokens.access)
      localStorage.setItem('refreshToken', tokens.refresh)
      console.log('💾 [AuthContext] Tokens saved to localStorage')
    }

    localStorage.setItem('user', JSON.stringify(userData))
    console.log('💾 [AuthContext] User saved to localStorage')

    setError(null)
    console.log('✨ [AuthContext] login() completed, user should now be authenticated')
  }

  const logout = async () => {
    try {
      await logoutAPI()
    } catch (err) {
      console.error('Logout error:', err)
      // Still clear local state even if API call fails
      clearAuth({ notify: true, reason: 'logout' })
    }
    setUser(null)
    setError(null)
  }

  const updateUser = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // isAuthenticated checks both React state AND localStorage
  // This handles the case where state hasn't updated yet but tokens are saved
  // When user logs in, setUser is async, so we use localStorage as a temporary backup
  const isAuthenticated = !!user || !!getAccessToken()

  const value = {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
    setError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to use auth context
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
