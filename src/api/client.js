import axios from 'axios'
import { clearAuth } from '../utils/auth'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'

const client = axios.create({
  baseURL: API_BASE,
})

client.interceptors.request.use((config) => {
  config.headers = config.headers || {}
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
  if (!isFormData && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }

  return config
})

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE}/auth/token/refresh`, {
          refresh: refreshToken,
        })

        localStorage.setItem('accessToken', response.data.access)
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh)
        }

        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
        return client(originalRequest)
      } catch (refreshError) {
        clearAuth({ notify: true, reason: 'session_expired' })
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const ProjectsAPI = {
  list: () => client.get('/projects/'),
  create: (name) => client.post('/projects/', { name }),
  rename: (id, name) => client.patch(`/projects/${id}/`, { name }),
  delete: (id) => client.delete(`/projects/${id}/`),
}

export const ChatAPI = {
  listSessions: (projectId) => client.get(`/chat/sessions/?project_id=${projectId}`),
  createSession: (projectId, title = null) => client.post('/chat/sessions/', { project_id: projectId, title: title || 'New Chat' }),
  sendMessage: (sessionId, content, documentId = null) => client.post('/chat/send/', {
    chat_session_id: sessionId,
    content,
    ...(documentId ? { document_id: documentId } : {}),
  }),
  // Streaming version — dùng native fetch để đọc SSE response
  sendMessageStream: async (sessionId, content, documentId = null) => {
    const token = localStorage.getItem('accessToken') || ''
    const baseURL = import.meta.env.VITE_API_URL || '/api'
    const res = await fetch(`${baseURL}/chat/stream/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        chat_session_id: sessionId,
        content,
        ...(documentId ? { document_id: documentId } : {}),
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }))
      throw new Error(err.error || `HTTP ${res.status}`)
    }
    return res  // caller đọc res.body (ReadableStream)
  },
  getSession: (id) => client.get(`/chat/sessions/${id}/`),
  updateSession: (id, payload) => client.patch(`/chat/sessions/${id}/`, payload),
  delete: (id) => client.delete(`/chat/sessions/${id}/`),
  getMessages: (sessionId) => client.get(`/chat/sessions/${sessionId}/messages/`),
  exportSession: (sessionId, format = 'pdf') => client.get(`/chat/sessions/${sessionId}/export/`, {
    params: { format },
    responseType: format === 'json' ? 'json' : 'blob',
  }),
  getEvaluation: (sessionId) => client.get('/chat/evaluations/', { params: { chat_session: sessionId } }),
  saveEvaluation: (payload) => client.post('/chat/evaluations/', payload),
}

export const UsersAPI = {
  search: (query) => client.get('/auth/users/search', { params: { q: query } }),
}


export const DocumentsAPI = {
  list: (params = {}) => {
    if (typeof params === 'string' || typeof params === 'number') {
      return client.get('/documents/', { params: { chat_session_id: params } })
    }
    return client.get('/documents/', { params })
  },
  upload: (chatSessionId, formData) => {
    if (!formData.get('chat_session_id')) formData.append('chat_session_id', String(chatSessionId))
    return client.post('/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  delete: (id) => client.delete(`/documents/${id}/`),
  bulkDelete: (documentIds) => client.post('/documents/bulk-delete/', { document_ids: documentIds }),
  index: (id) => client.post(`/documents/${id}/reindex/`),
  reindex: (id) => client.post(`/documents/${id}/reindex/`),
  getFields: (id) => client.get(`/documents/${id}/fields/`),
  getOcrLayout: (id) => client.get(`/documents/${id}/ocr-layout/`),
  reextractFields: (id) => client.post(`/documents/${id}/reextract-fields/`),
  share: (id, email) => client.post(`/documents/${id}/share/`, { email }),
  bulkShare: (documentIds, email) => client.post('/documents/bulk-share/', { document_ids: documentIds, email }),
  summary: (id, force = false) => client.post(`/documents/${id}/summary/`, { force }),
  getSummary: (id) => client.get(`/documents/${id}/summary/`),
  // Get full extracted text for preview
  getText: (id) => client.get(`/documents/${id}/text/`),
  // URL for inline file preview via iframe (JWT added via query param workaround)
  previewUrl: (id) => {
    const token = localStorage.getItem('accessToken')
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '')
    return `${base}/documents/${id}/preview/?token=${token}`
  },
}

export const TeamsAPI = {
  list: () => client.get('/teams/'),
  create: (name) => client.post('/teams/', { name }),
  invite: (teamId, emails) => client.post(`/teams/${teamId}/invite/`, { emails }),
  leave: (teamId) => client.post(`/teams/${teamId}/leave/`),
  kickMember: (teamId, userId) => client.post(`/teams/${teamId}/kick-member/`, { user_id: userId }),
  documents: (teamId) => client.get(`/teams/${teamId}/documents/`),
  uploadDocuments: (teamId, formData) => client.post(`/teams/${teamId}/documents/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  invitations: () => client.get('/team-invitations/'),
  acceptInvitation: (id) => client.post(`/team-invitations/${id}/accept/`),
  rejectInvitation: (id) => client.post(`/team-invitations/${id}/reject/`),
  attachDocumentsToChat: (chatSessionId, documentIds) => client.post('/chat/attach-documents/', {
    chat_session_id: chatSessionId,
    document_ids: documentIds,
  }),
  detachDocumentFromChat: (chatSessionId, documentId) => client.delete('/chat/attach-documents/', {
    data: { chat_session_id: chatSessionId, document_id: documentId },
  }),
  sharedLibrary: () => client.get('/library/shared/'),
}

export const NotificationsAPI = {
  list: () => client.get('/notifications/'),
  markRead: (id) => client.post(`/notifications/${id}/mark-read/`),
}

export const StatisticsAPI = {
  overview: (params = {}) => client.get('/projects/statistics/', { params }),
  export: (params = {}, format = 'csv') => client.get('/dashboard/export/', {
    params: { ...params, format },
    responseType: format === 'json' ? 'json' : 'blob',
  }),
}

export const EvaluationsAPI = {
  list: (params = {}) => client.get('/chat/evaluations/', { params }),
  stats: () => client.get('/chat/evaluations/stats/'),
  pin: (id) => client.post(`/chat/evaluations/${id}/pin/`),
  unpin: (id) => client.post(`/chat/evaluations/${id}/unpin/`),
}

export const AdminUsersAPI = {
  listUsers: (params = {}) => client.get('/auth/admin/users', { params }),
  setStatus: (id, isActive) => client.patch(`/auth/admin/users/${id}/status`, { is_active: isActive }),
  setRole: (id, role) => client.patch(`/auth/admin/users/${id}/role`, { role }),
  setGroups: (id, groupIds) => client.patch(`/auth/admin/users/${id}/groups`, { group_ids: groupIds }),
  resetPassword: (id, password, passwordConfirm) => client.post(`/auth/admin/users/${id}/reset-password`, {
    password,
    password_confirm: passwordConfirm,
  }),
  deleteUser: (id) => client.delete(`/auth/admin/users/${id}`),
  logs: (id) => client.get(`/auth/admin/users/${id}/logs`),
  listGroups: () => client.get('/auth/admin/groups'),
  createGroup: (payload) => client.post('/auth/admin/groups', payload),
  updateGroup: (id, payload) => client.patch(`/auth/admin/groups/${id}`, payload),
  deleteGroup: (id) => client.delete(`/auth/admin/groups/${id}`),
  listPermissions: () => client.get('/auth/admin/permissions'),
}

export const AccountLogsAPI = {
  mine: () => client.get('/auth/me/logs'),
}

export default client
