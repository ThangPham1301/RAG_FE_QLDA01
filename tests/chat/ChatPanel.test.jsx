import { act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatPanel from '../../src/components/chat/ChatPanel'
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

const { ChatAPI } = jest.requireMock('../../src/api/client')

function createDeferred() {
  let resolve
  const promise = new Promise((res) => {
    resolve = res
  })
  return { promise, resolve }
}

describe('ChatPanel integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ChatAPI.getSession.mockResolvedValue({ data: { messages: [] } })
    ChatAPI.sendMessage.mockResolvedValue({
      data: {
        assistant_message: { id: 'a-default', role: 'assistant', content: 'Default assistant response' },
      },
    })
  })

  it('loads chat history in correct order and role alignment', async () => {
    ChatAPI.getSession.mockResolvedValue({
      data: {
        messages: [
          { id: 'a-1', role: 'assistant', content: 'Assistant hello' },
          { id: 'u-1', role: 'user', content: 'User hello' },
        ],
      },
    })

    renderWithChatContext(<ChatPanel />)

    expect(await screen.findByText('Assistant hello')).toBeInTheDocument()
    expect(screen.getByText('User hello')).toBeInTheDocument()

    const assistantBubble = screen.getByText('Assistant hello').closest('[class*="shadow-sm"]')
    const userBubble = screen.getByText('User hello').closest('[class*="shadow-sm"]')

    expect(assistantBubble.className).not.toContain('ml-auto')
    expect(userBubble.className).toContain('ml-auto')
    expect(assistantBubble.compareDocumentPosition(userBubble) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('shows empty state when chat has no message', async () => {
    renderWithChatContext(<ChatPanel />)
    expect(await screen.findByText('Start a new conversation by asking a question.')).toBeInTheDocument()
  })

  it('sends message, shows loading state, and renders assistant response without duplicates', async () => {
    const user = userEvent.setup()
    const deferred = createDeferred()
    ChatAPI.sendMessage.mockReturnValueOnce(deferred.promise)

    renderWithChatContext(<ChatPanel />)

    const input = screen.getByPlaceholderText('Ask the archive a specific question...')
    await user.type(input, 'How are you?')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    expect(screen.getByText('How are you?')).toBeInTheDocument()
    expect(screen.getByLabelText('Assistant is responding')).toBeInTheDocument()
    expect(input).toBeDisabled()

    deferred.resolve({
      data: {
        assistant_message: { id: 'a-2', role: 'assistant', content: 'I am fine.' },
      },
    })

    expect(await screen.findByText('I am fine.')).toBeInTheDocument()
    expect(screen.getAllByText('How are you?')).toHaveLength(1)
    expect(screen.queryByLabelText('Assistant is responding')).not.toBeInTheDocument()
    expect(input).not.toBeDisabled()
  })

  it('auto scrolls message container to bottom when messages change', async () => {
    const scrollTopSetter = jest.fn()
    const originalScrollTop = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollTop')
    const originalScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')

    Object.defineProperty(HTMLElement.prototype, 'scrollTop', {
      configurable: true,
      get: () => 0,
      set: scrollTopSetter,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      configurable: true,
      get: () => 999,
    })

    try {
      ChatAPI.getSession.mockResolvedValue({
        data: {
          messages: [
            { id: 'm-1', role: 'assistant', content: 'm1' },
            { id: 'm-2', role: 'user', content: 'm2' },
            { id: 'm-3', role: 'assistant', content: 'm3' },
            { id: 'm-4', role: 'user', content: 'm4' },
          ],
        },
      })

      renderWithChatContext(<ChatPanel />)

      expect(await screen.findByText('m4')).toBeInTheDocument()
      expect(screen.getByTestId('chat-scroll-container')).toBeInTheDocument()
      expect(scrollTopSetter).toHaveBeenCalledWith(999)
    } finally {
      if (originalScrollTop) {
        Object.defineProperty(HTMLElement.prototype, 'scrollTop', originalScrollTop)
      }
      if (originalScrollHeight) {
        Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originalScrollHeight)
      }
    }
  })

  it('switches chat and loads correct history without mixing messages', async () => {
    ChatAPI.getSession.mockImplementation((sessionId) => {
      if (sessionId === 10) {
        return Promise.resolve({
          data: { messages: [{ id: 's10-1', role: 'assistant', content: 'Message from session 10' }] },
        })
      }

      if (sessionId === 20) {
        return Promise.resolve({
          data: { messages: [{ id: 's20-1', role: 'assistant', content: 'Message from session 20' }] },
        })
      }

      return Promise.resolve({ data: { messages: [] } })
    })

    const { getChatState } = renderWithChatContext(<ChatPanel />)

    expect(await screen.findByText('Message from session 10')).toBeInTheDocument()

    act(() => {
      getChatState().setCurrentSession({ id: 20, project: 1, title: 'Session 20', selected_document_ids: [] })
    })

    expect(await screen.findByText('Message from session 20')).toBeInTheDocument()
    expect(screen.queryByText('Message from session 10')).not.toBeInTheDocument()
    expect(ChatAPI.getSession).toHaveBeenCalledWith(20)
  })

  it('shows error message when loading chat history fails', async () => {
    ChatAPI.getSession.mockRejectedValueOnce(new Error('network down'))
    renderWithChatContext(<ChatPanel />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Không thể tải lịch sử chat.')
    expect(screen.getByPlaceholderText('Ask the archive a specific question...')).toBeInTheDocument()
  })

  it('shows error message when send message API fails', async () => {
    const user = userEvent.setup()
    ChatAPI.sendMessage.mockRejectedValueOnce({
      response: { data: { error: 'Send failed from API' } },
    })

    renderWithChatContext(<ChatPanel />)

    await user.type(screen.getByPlaceholderText('Ask the archive a specific question...'), 'Fail request')
    await user.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Send failed from API')
    })

    expect(screen.getByPlaceholderText('Ask the archive a specific question...')).toBeInTheDocument()
  })
})
