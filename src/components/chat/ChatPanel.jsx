import { useEffect, useRef, useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { ChatAPI } from '../../api/client'
import { useChat } from '../../context/useChat'

function ChatPanel() {
  const { selectedProject, currentSession } = useChat()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendError, setSendError] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const sessionId = currentSession?.id
    if (!sessionId) {
      setMessages([])
      setSendError('')
      return undefined
    }

    let mounted = true
    setMessages([])

    ChatAPI.getSession(sessionId)
      .then((response) => {
        if (!mounted) return
        setMessages(response.data.messages || [])
        setSendError('')
      })
      .catch((error) => {
        console.error('[Chat] getSession error:', error)
        setSendError('Không thể tải lịch sử chat.')
      })

    return () => {
      mounted = false
    }
  }, [currentSession?.id])

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (currentSession?.id && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentSession?.id])

  const sendQuestion = async () => {
    const question = input.trim()
    if (!question || !currentSession || loading) return

    const userMessage = { id: `u-${Date.now()}`, role: 'user', content: question }
    setMessages((list) => [...list, userMessage])
    setInput('')
    setSendError('')
    setLoading(true)

    try {
      const response = await ChatAPI.sendMessage(currentSession.id, question)
      const assistant = response.data.message || response.data.assistant_message || response.data.assistant || { role: 'assistant', content: response.data.answer || response.data.response || '' }
      setMessages((list) => [...list.filter((item) => item.id !== userMessage.id), userMessage, assistant])
    } catch (error) {
      console.error('[Chat] Error sending message:', error)
      const errorMessage = error?.response?.data?.error || error?.response?.data?.detail || 'Không thể gửi câu hỏi. Vui lòng thử lại.'
      setSendError(String(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-[#f8f9ff]">
      <div ref={containerRef} className="min-h-0 flex-1 overflow-y-auto px-8 py-6" data-testid="chat-scroll-container">
        <div className="mx-auto max-w-180 space-y-6">
          <div className="text-center">
            <span className="rounded-full bg-[#eff4ff] px-4 py-1 text-[10px] font-semibold tracking-wide text-slate-500">
              {selectedProject ? selectedProject.name : 'No project selected'}
            </span>
          </div>

          <div className="space-y-4">
            {!loading && messages.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-300 bg-white/70 px-6 py-8 text-center text-sm text-slate-500">
                Start a new conversation by asking a question.
              </div>
            )}

            {messages.map((message) => (
              <div key={message.id} className={`${message.role === 'user' ? 'ml-auto max-w-107.5 rounded-xl bg-blue-950 text-white' : 'max-w-107.5 rounded-xl bg-white text-slate-900'} px-6 py-4 shadow-sm`}>
                <div className="text-sm leading-relaxed">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Sources: {message.sources.map((source, index) => <span key={index} className="mr-2 inline-block">{source.document_title || source.document_id}</span>)}
                  </div>
                )}
                {message.contexts && message.contexts.length > 0 && (
                  <div className="mt-2 text-[11px] text-slate-500">
                    Contexts: {message.contexts.map((context) => <span key={context.id} className="mr-2 inline-block">{context.document_id}</span>)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-107.5 rounded-xl bg-white px-6 py-4 text-slate-900 shadow-sm" aria-live="polite" aria-label="Assistant is responding">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <span>Đang phản hồi</span>
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:150ms]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:300ms]" />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-[#f8f9ff] px-8 py-6">
        {sendError && (
          <div className="mx-auto mb-3 flex max-w-190 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">
            <AlertCircle size={14} />
            <span>{sendError}</span>
          </div>
        )}
        <div className="mx-auto flex max-w-190 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            type="text"
            placeholder="Ask the archive a specific question..."
            disabled={loading || !currentSession}
            className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button type="button" onClick={sendQuestion} disabled={loading || !currentSession} aria-label="Send message" className="ml-1 grid h-10 w-10 place-items-center rounded-xl bg-linear-to-r from-black to-blue-950 shadow-sm disabled:opacity-50">
            <span className="h-3 w-3 rounded-sm bg-white" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChatPanel
