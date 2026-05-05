import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatPage from '../../src/pages/ChatPage'
import { renderWithChatContext } from './testUtils'

jest.mock('../../src/components/layout/ChatTopBar', () => function ChatTopBarMock() {
  return <div data-testid="chat-top-bar">TopBar</div>
})

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

describe('ChatPage integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ChatAPI.listSessions.mockResolvedValue({
      data: { results: [{ id: 10, project: 1, title: 'Session 10', selected_document_ids: [] }] },
    })
    ChatAPI.createSession.mockResolvedValue({
      data: { id: 11, project: 1, title: 'New Chat', selected_document_ids: [] },
    })
    ChatAPI.updateSession.mockResolvedValue({
      data: { id: 10, project: 1, title: 'Session 10', selected_document_ids: [100] },
    })
    ChatAPI.sendMessage.mockResolvedValue({
      data: {
        assistant_message: { id: 'a-1', role: 'assistant', content: 'Assistant reply' },
      },
    })
    ChatAPI.getSession.mockResolvedValue({ data: { messages: [] } })
    DocumentsAPI.list.mockResolvedValue({
      data: {
        results: [{ id: 100, title: 'Policy 2026', file_type: 'pdf', index_status: 'indexed' }],
      },
    })
  })

  it('renders sidebar, chat panel and input box', async () => {
    renderWithChatContext(<ChatPage />)

    expect(screen.getByText('Cognitive Slate')).toBeInTheDocument()
    expect(screen.getByTestId('chat-top-bar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ask the archive a specific question...')).toBeInTheDocument()

    await waitFor(() => {
      expect(ChatAPI.getSession).toHaveBeenCalled()
    })
  })

  it('creates a new chat, clears old messages and focuses input', async () => {
    const user = userEvent.setup()
    ChatAPI.getSession.mockImplementation((sessionId) => {
      if (sessionId === 10) {
        return Promise.resolve({
          data: { messages: [{ id: 'm-1', role: 'assistant', content: 'Existing assistant message' }] },
        })
      }
      if (sessionId === 11) {
        return Promise.resolve({ data: { messages: [] } })
      }
      return Promise.resolve({ data: { messages: [] } })
    })

    renderWithChatContext(<ChatPage />)

    expect(await screen.findByText('Existing assistant message')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /new chat/i }))

    await waitFor(() => {
      expect(ChatAPI.createSession).toHaveBeenCalledWith(1)
    })

    expect(await screen.findByText('Start a new conversation by asking a question.')).toBeInTheDocument()
    expect(screen.queryByText('Existing assistant message')).not.toBeInTheDocument()

    const input = screen.getByPlaceholderText('Ask the archive a specific question...')
    await waitFor(() => {
      expect(input).toHaveFocus()
    })
  })

  it('sends message with selected document ids from Context Files', async () => {
    const user = userEvent.setup()
    renderWithChatContext(<ChatPage />)

    await user.click(screen.getByRole('button', { name: /context files/i }))

    expect(await screen.findByText('Choose files used as default retrieval scope')).toBeInTheDocument()

    const row = screen.getByText('Policy 2026').closest('label')
    const checkbox = within(row).getByRole('checkbox')
    await user.click(checkbox)

    await waitFor(() => {
      expect(ChatAPI.updateSession).toHaveBeenCalledWith(10, { selected_document_ids: [100] })
    })

    await user.type(screen.getByPlaceholderText('Ask the archive a specific question...'), 'Question with selected file')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('Question with selected file')).toBeInTheDocument()

    await waitFor(() => {
      expect(ChatAPI.sendMessage).toHaveBeenCalledWith(10, 'Question with selected file', [100])
    })
  })
})
