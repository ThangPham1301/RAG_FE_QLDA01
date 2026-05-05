import { screen, waitFor } from '@testing-library/react'
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
    ChatAPI.listSessions.mockResolvedValue({ data: { results: [] } })
    ChatAPI.getSession.mockResolvedValue({ data: { messages: [] } })
    DocumentsAPI.list.mockResolvedValue({ data: { results: [] } })
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
})
