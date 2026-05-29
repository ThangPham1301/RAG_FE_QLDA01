import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const isAdminUser = (user) => Boolean(user?.role === 'admin' || user?.is_staff || user?.is_superuser)

const LoadingScreen = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="text-center">
      <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-800" />
      <p className="text-slate-600">Loading...</p>
    </div>
  </div>
)

export const ProtectedRoute = ({ children, adminOnly = false, userOnly = false }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && !isAdminUser(user)) {
    return <Navigate to="/library" replace />
  }

  if (userOnly && isAdminUser(user)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <LoadingScreen />
  }

  if (isAuthenticated) {
    return <Navigate to={isAdminUser(user) ? '/dashboard' : '/library'} replace />
  }

  return children
}
