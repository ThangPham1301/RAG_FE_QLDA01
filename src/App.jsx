import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { RealtimeProvider } from './context/RealtimeContext'
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute'
import AccountPage from './pages/AccountPage'
import ActivityPage from './pages/ActivityPage'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import LibraryPage from './pages/LibraryPage'
import UserManagementPage from './pages/UserManagementPage'
import TeamPage from './pages/TeamPage'
import RegisterPage from './pages/RegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public routes - redirect to dashboard if already authenticated */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-email"
          element={
            <PublicRoute>
              <VerifyEmailPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />

        {/* Protected routes - redirect to login if not authenticated */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute superAdminOnly>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route path="/statistics" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute superAdminOnly>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute userOnly>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute userOnly>
              <TeamPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/document/:id"
          element={
            <ProtectedRoute userOnly>
              <DocumentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test/document/1"
          element={
            <ProtectedRoute userOnly>
              <DocumentDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute userOnly>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/activity"
          element={
            <ProtectedRoute userOnly>
              <ActivityPage />
            </ProtectedRoute>
          }
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </RealtimeProvider>
    </AuthProvider>
  )
}

export default App
