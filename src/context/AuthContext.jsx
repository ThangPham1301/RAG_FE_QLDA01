import { createContext, useContext, useState, useEffect } from 'react'
import { getCurrentUser, logout as logoutAPI } from '../services/authService'
import { getStoredUser, getAccessToken, clearAuth } from '../utils/auth'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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
          } catch (err) {
            // Token invalid, clear auth
            clearAuth()
            setUser(null)
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
  }, [])

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
      clearAuth()
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
