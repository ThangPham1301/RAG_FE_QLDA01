import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ChatPanel from '../../src/components/chat/ChatPanel'
import { ChatContext } from '../../src/context/chatContext'
import { ChatAPI } from '../../src/api/client'

jest.mock('../../src/api/client', () => ({
  ChatAPI: {
    getSession: jest.fn(),
    getEvaluation: jest.fn(),
    saveEvaluation: jest.fn(),
    exportSession: jest.fn(),
    createSession: jest.fn(),
    sendMessageStream: jest.fn(),
  },
  DocumentsAPI: {
    upload: jest.fn(),
  },
}))

jest.mock('../../src/components/chat/TeamDocumentPickerModal', () => () => null)
jest.mock('../../src/components/chat/SharedDocumentPickerModal', () => () => null)

const selectedProject = { id: 7, name: 'Thang' }
const selectedChat = {
  id: 11,
  title: 'VanBan chat',
  documents: [],
  isTemporary: false,
}

const renderChatPanel = (chat = selectedChat) => {
  const contextValue = {
    selectedProject,
    selectedChat: chat,
    setSelectedChat: jest.fn(),
    setProjects: jest.fn(),
  }

  render(
    <ChatContext.Provider value={contextValue}>
      <ChatPanel />
    </ChatContext.Provider>
  )

  return contextValue
}

beforeEach(() => {
  ChatAPI.getSession.mockResolvedValue({ data: { messages: [] } })
  ChatAPI.getEvaluation.mockResolvedValue({ data: [] })
  ChatAPI.saveEvaluation.mockResolvedValue({
    data: { id: 1, chat_session: selectedChat.id, rating: 5, comment: 'Useful' },
  })
})

describe('ChatPanel conversation evaluation', () => {
  test('loads an existing evaluation and shows the collapsed evaluation control', async () => {
    ChatAPI.getEvaluation.mockResolvedValue({
      data: [{ id: 1, chat_session: selectedChat.id, rating: 4, comment: 'Good' }],
    })

    renderChatPanel()

    expect(await screen.findByText('Đã đánh giá 4/5')).toBeInTheDocument()
    expect(ChatAPI.getEvaluation).toHaveBeenCalledWith(selectedChat.id)
  })

  test('saves a new conversation evaluation from the chat input area', async () => {
    renderChatPanel()

    await waitFor(() => expect(ChatAPI.getEvaluation).toHaveBeenCalled())

    fireEvent.click(screen.getByLabelText('Đánh giá 5 sao'))
    fireEvent.change(screen.getByPlaceholderText('Nhận xét ngắn...'), {
      target: { value: 'Useful' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Lưu' }))

    await waitFor(() => {
      expect(ChatAPI.saveEvaluation).toHaveBeenCalledWith({
        chat_session: selectedChat.id,
        rating: 5,
        accuracy_rating: 5,
        usefulness_rating: 5,
        grounding_rating: 5,
        comment: 'Useful',
      })
    })
    expect(await screen.findByText('Đã lưu đánh giá.')).toBeInTheDocument()
  })

  test('lets the user reopen and update an existing evaluation', async () => {
    ChatAPI.getEvaluation.mockResolvedValue({
      data: [{ id: 1, chat_session: selectedChat.id, rating: 3, comment: 'Old' }],
    })
    ChatAPI.saveEvaluation.mockResolvedValue({
      data: { id: 1, chat_session: selectedChat.id, rating: 4, comment: 'Better' },
    })

    renderChatPanel()

    fireEvent.click(await screen.findByText('Đã đánh giá 3/5'))
    fireEvent.click(screen.getByLabelText('Đánh giá 4 sao'))
    fireEvent.change(screen.getByPlaceholderText('Nhận xét ngắn...'), {
      target: { value: 'Better' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Cập nhật' }))

    await waitFor(() => {
      expect(ChatAPI.saveEvaluation).toHaveBeenCalledWith(expect.objectContaining({
        chat_session: selectedChat.id,
        rating: 4,
        comment: 'Better',
      }))
    })
    expect(await screen.findByText('Đã cập nhật đánh giá.')).toBeInTheDocument()
  })
})
