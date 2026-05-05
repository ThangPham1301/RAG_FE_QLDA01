import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE || 'http://localhost:8000/api'
let isRedirectingToLogin = false

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
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')

        // Avoid hard-reload loops when we're already on auth pages.
        const path = window.location.pathname
        const isAuthRoute = path === '/login' || path === '/register' || path === '/forgot-password' || path === '/verify-email'
        if (!isAuthRoute && !isRedirectingToLogin) {
          isRedirectingToLogin = true
          window.location.replace('/login')
        }
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
  createSession: (projectId, title = null) => client.post('/chat/sessions/', { project: projectId, title: title || 'New Chat' }),
  sendMessage: (sessionId, content, selectedDocumentIds = []) => client.post(`/chat/sessions/${sessionId}/send_message/`, {
    content,
    selected_document_ids: selectedDocumentIds,
  }),
  getSession: (id) => client.get(`/chat/sessions/${id}/`),
  updateSession: (id, payload) => client.patch(`/chat/sessions/${id}/`, payload),
  getMessages: (sessionId) => client.get(`/chat/sessions/${sessionId}/messages/`),
}

export const DocumentsAPI = {
  list: (projectId = null) => {
    if (projectId === null || projectId === undefined || projectId === '') {
      return client.get('/documents/')
    }
    return client.get(`/documents/?project=${projectId}`)
  },
  upload: (projectId, formData, chatSessionId = null) => {
    if (!formData.get('project')) formData.append('project', String(projectId))
    if (chatSessionId && !formData.get('chat_session')) formData.append('chat_session', String(chatSessionId))
    return client.post('/documents/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  index: (id) => client.post(`/documents/${id}/index/`),
  summary: (id, force = false) => client.post(`/documents/${id}/summary/`, { force }),
  getSummary: (id) => client.get(`/documents/${id}/summary/`),
}

export const StatisticsAPI = {
  overview: () => client.get('/projects/statistics/'),
}

export default client
