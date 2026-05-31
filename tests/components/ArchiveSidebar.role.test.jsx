import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ArchiveSidebar from '../../src/components/layout/ArchiveSidebar'

let mockAuthState

jest.mock('../../src/context/AuthContext', () => ({
  useAuth: () => mockAuthState,
}))

jest.mock('../../src/context/AppSettingsContext', () => ({
  useAppSettings: () => ({
    t: {
      nav: {
        dashboard: 'Dashboard',
        users: 'User Management',
        library: 'Library',
        chat: 'Chat',
        team: 'Team',
        settings: 'Settings',
      },
    },
  }),
}))

const renderSidebar = (user) => {
  mockAuthState = { user }
  render(
    <MemoryRouter>
      <ArchiveSidebar />
    </MemoryRouter>
  )
}

describe('ArchiveSidebar role navigation', () => {
  test('regular users see library, chat, team and settings only', () => {
    renderSidebar({ role: 'user' })

    expect(screen.getByText('Library')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('User Management')).not.toBeInTheDocument()
  })

  test('admins keep user features and dashboard but not user management', () => {
    renderSidebar({ role: 'admin' })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Library')).toBeInTheDocument()
    expect(screen.getByText('Chat')).toBeInTheDocument()
    expect(screen.getByText('Team')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.queryByText('User Management')).not.toBeInTheDocument()
  })

  test('superadmins see dashboard, user management and settings only', () => {
    renderSidebar({ role: 'superadmin' })

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('User Management')).toBeInTheDocument()
    expect(screen.getByText('Settings')).toBeInTheDocument()
    expect(screen.queryByText('Library')).not.toBeInTheDocument()
    expect(screen.queryByText('Chat')).not.toBeInTheDocument()
    expect(screen.queryByText('Team')).not.toBeInTheDocument()
  })
})
