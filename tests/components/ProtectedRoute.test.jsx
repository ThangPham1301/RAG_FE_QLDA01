import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, PublicRoute, isAdminUser, isSuperAdminUser } from '../../src/components/ProtectedRoute'

let mockAuthState

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}))

const renderWithRoutes = (element, initialPath = '/') => {
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={element} />
        <Route path="/login" element={<div>Login page</div>} />
        <Route path="/library" element={<div>Library page</div>} />
        <Route path="/dashboard" element={<div>Dashboard page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  test('role helpers identify admin and superadmin users', () => {
    expect(isAdminUser({ role: 'admin' })).toBe(true)
    expect(isAdminUser({ is_staff: true })).toBe(true)
    expect(isSuperAdminUser({ is_superuser: true })).toBe(true)
    expect(isAdminUser({ role: 'user' })).toBe(false)
  })

  test('redirects anonymous users to login', () => {
    mockAuthState = { isAuthenticated: false, loading: false, user: null }

    renderWithRoutes(<ProtectedRoute><div>Private</div></ProtectedRoute>)

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  test('renders children for authenticated users', () => {
    mockAuthState = { isAuthenticated: true, loading: false, user: { role: 'user' } }

    renderWithRoutes(<ProtectedRoute><div>Private</div></ProtectedRoute>)

    expect(screen.getByText('Private')).toBeInTheDocument()
  })

  test('redirects authenticated users away from public routes', () => {
    mockAuthState = { isAuthenticated: true, loading: false, user: { role: 'admin' } }

    renderWithRoutes(<PublicRoute><div>Login form</div></PublicRoute>)

    expect(screen.getByText('Dashboard page')).toBeInTheDocument()
  })
})
