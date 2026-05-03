import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protected Route component
 * Redirects to login if user is not authenticated
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  console.log('🔒 [ProtectedRoute] Checking auth status...')
  console.log('   isAuthenticated:', isAuthenticated)
  console.log('   loading:', loading)
  console.log('   user:', user ? `✅ ${user.email}` : '❌ null (but may check localStorage)')

  if (loading) {
    console.log('⏳ [ProtectedRoute] Still loading...')
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-800 mx-auto" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    console.log('❌ [ProtectedRoute] User not authenticated, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  console.log('✅ [ProtectedRoute] User authenticated, rendering children')
  return children
}

/**
 * Public Route component
 * Redirects to dashboard if user is already authenticated
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-800 mx-auto" />
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
