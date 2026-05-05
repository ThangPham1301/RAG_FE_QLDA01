import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatSidebar from '../../src/components/chat/ChatSidebar'
import { renderWithChatContext } from './testUtils'

jest.mock('../../src/api/client', () => ({
  ChatAPI: {
    listSessions: jest.fn(),
    createSession: jest.fn(),
    sendMessage: jest.fn(),
    getSession: jest.fn(),
    updateSession: jest.fn(),
    getMessages: jest.fn(),
  },
  DocumentsAPI: {
    list: jest.fn(),
    upload: jest.fn(),
    index: jest.fn(),
    summary: jest.fn(),
    getSummary: jest.fn(),
  },
  ProjectsAPI: {
    list: jest.fn(),
    create: jest.fn(),
    rename: jest.fn(),
    delete: jest.fn(),
  },
}))

const { ChatAPI, DocumentsAPI } = jest.requireMock('../../src/api/client')

describe('ChatSidebar integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ChatAPI.listSessions.mockResolvedValue({
      data: {
        results: [
          { id: 10, title: 'Session 10', selected_document_ids: [] },
          { id: 20, title: 'Session 20', selected_document_ids: [200] },
        ],
      },
    })
    ChatAPI.createSession.mockResolvedValue({ data: { id: 11, project: 1, title: 'New Chat', selected_document_ids: [] } })
    ChatAPI.updateSession.mockResolvedValue({ data: { id: 10, project: 1, title: 'Session 10', selected_document_ids: [100] } })
    DocumentsAPI.list.mockResolvedValue({
      data: {
        results: [
          { id: 100, title: 'Policy 2026', file_type: 'pdf', index_status: 'indexed' },
          { id: 200, title: 'Policy 2027', file_type: 'pdf', index_status: 'indexed' },
        ],
      },
    })
  })

  it('toggles Chat dropdown inline under Chat menu item', async () => {
    const user = userEvent.setup()
    renderWithChatContext(<ChatSidebar />)

    const chatButton = screen.getByRole('button', { name: /^Chat$/i })
    const accordion = document.getElementById('chat-accordion')

    expect(chatButton).toHaveAttribute('aria-expanded', 'true')
    expect(chatButton.parentElement.querySelector('#chat-accordion')).toBe(accordion)

    const summarizeButton = screen.getByRole('button', { name: /summarize/i })
    expect(accordion.compareDocumentPosition(summarizeButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()

    await user.click(chatButton)
    expect(chatButton).toHaveAttribute('aria-expanded', 'false')

    await user.click(chatButton)
    expect(chatButton).toHaveAttribute('aria-expanded', 'true')
  })

  it('creates a new chat session from New Chat button', async () => {
    const user = userEvent.setup()
    const { getChatState } = renderWithChatContext(<ChatSidebar />)

    await user.click(screen.getByRole('button', { name: /new chat/i }))

    await waitFor(() => {
      expect(ChatAPI.createSession).toHaveBeenCalledWith(1)
    })

    expect(getChatState().currentSession.id).toBe(11)
    expect(getChatState().selectedDocumentIds).toEqual([])
  })

  it('opens context files modal and updates selected documents', async () => {
    const user = userEvent.setup()
    const { getChatState } = renderWithChatContext(<ChatSidebar />)

    await user.click(screen.getByRole('button', { name: /context files/i }))

    const modal = await screen.findByText('Choose files used as default retrieval scope')
    expect(modal).toBeInTheDocument()

    const docRow = screen.getByText('Policy 2026').closest('label')
    const checkbox = within(docRow).getByRole('checkbox')
    await user.click(checkbox)

    await waitFor(() => {
      expect(ChatAPI.updateSession).toHaveBeenCalledWith(10, { selected_document_ids: [100] })
    })

    expect(getChatState().selectedDocumentIds).toEqual([100])
  })

  it('switches active chat session without mixing selected documents', async () => {
    const user = userEvent.setup()
    const { getChatState } = renderWithChatContext(<ChatSidebar />)

    expect(await screen.findByText('Session 20')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /session 20/i }))

    expect(getChatState().currentSession.id).toBe(20)
    expect(getChatState().selectedDocumentIds).toEqual([200])
  })
})
