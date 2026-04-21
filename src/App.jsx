import { Navigate, Route, Routes } from 'react-router-dom'
import AccountPage from './pages/AccountPage'
import ActivityPage from './pages/ActivityPage'
import AuthPage from './pages/AuthPage'
import ChatPage from './pages/ChatPage'
import DashboardPage from './pages/DashboardPage'
import DocumentDetailPage from './pages/DocumentDetailPage'
import LibraryPage from './pages/LibraryPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/library" element={<LibraryPage />} />
      <Route path="/document/:id" element={<DocumentDetailPage />} />
      <Route path="/test/document/1" element={<DocumentDetailPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/account" element={<AccountPage />} />
      <Route path="/activity" element={<ActivityPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
