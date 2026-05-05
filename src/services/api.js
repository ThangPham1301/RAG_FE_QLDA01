import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
let isRedirectingToLogin = false

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
})

// Add token to requests
apiClient.interceptors.request.use((config) => {
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

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_URL}/auth/token/refresh`, {
          refresh: refreshToken,
        })

        localStorage.setItem('accessToken', response.data.access)
        if (response.data.refresh) {
          localStorage.setItem('refreshToken', response.data.refresh)
        }

        // Retry original request
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Refresh failed, logout user
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

export default apiClient
