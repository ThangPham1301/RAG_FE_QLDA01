import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import DashboardPage from '../../src/pages/DashboardPage'
import { StatisticsAPI } from '../../src/api/client'

jest.mock('../../src/api/client', () => ({
  StatisticsAPI: {
    overview: jest.fn(),
  },
}))

jest.mock('../../src/components/layout/WorkspaceTopBar', () => function MockWorkspaceTopBar() {
  return <div data-testid="workspace-topbar">topbar</div>
})

describe('DashboardPage statistics', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders metrics and recent uploads from statistics endpoint', async () => {
    StatisticsAPI.overview.mockResolvedValue({
      data: {
        total_projects: 2,
        total_documents: 6,
        indexed_documents: 5,
        indexing_documents: 1,
        failed_documents: 0,
        total_indexed_chunks: 44,
        active_chat_sessions: 3,
        recent_uploads: [
          {
            title: 'Roadmap Q3',
            project_name: 'Project Beta',
            chat_session_title: 'Weekly Review',
            uploaded_at: new Date().toISOString(),
          },
        ],
      },
    })

    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    )

    await waitFor(() => expect(StatisticsAPI.overview).toHaveBeenCalledTimes(1))

    expect(screen.getByText('TOTAL DOCUMENTS')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('INDEXED CHUNKS')).toBeInTheDocument()
    expect(screen.getByText('44')).toBeInTheDocument()
    expect(screen.getByText('Roadmap Q3')).toBeInTheDocument()
    expect(screen.getByText('Project Beta • Weekly Review')).toBeInTheDocument()
  })
})
