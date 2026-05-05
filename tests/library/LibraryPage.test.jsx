import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LibraryPage from '../../src/pages/LibraryPage'
import { DocumentsAPI } from '../../src/api/client'

jest.mock('../../src/api/client', () => ({
  DocumentsAPI: {
    list: jest.fn(),
  },
}))

jest.mock('../../src/components/layout/WorkspaceTopBar', () => function MockWorkspaceTopBar() {
  return <div data-testid="workspace-topbar">topbar</div>
})

describe('LibraryPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders library documents from chat uploads and hides upload area', async () => {
    DocumentsAPI.list.mockResolvedValue({
      data: [
        {
          id: 11,
          title: 'Policy Handbook',
          file_type: 'pdf',
          project_name: 'Project Alpha',
          uploaded_chat_session: 77,
          uploaded_chat_session_title: 'Sprint Planning Chat',
          index_status: 'indexed',
          updated_at: '2026-05-05T08:00:00Z',
          file_url: 'http://localhost:8000/media/policy.pdf',
        },
      ],
    })

    render(
      <MemoryRouter>
        <LibraryPage />
      </MemoryRouter>
    )

    await waitFor(() => expect(DocumentsAPI.list).toHaveBeenCalledTimes(1))

    expect(screen.getByText('Policy Handbook')).toBeInTheDocument()
    expect(screen.getByText('Project Alpha')).toBeInTheDocument()
    expect(screen.getByText('Sprint Planning Chat')).toBeInTheDocument()
    expect(screen.queryByText('Ingest New Research')).not.toBeInTheDocument()
    expect(screen.queryByText('Browse Files')).not.toBeInTheDocument()
  })
})
