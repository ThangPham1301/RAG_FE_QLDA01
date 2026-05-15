import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Send } from 'lucide-react'
import { ChatAPI } from '../../api/client'
import { useChat } from '../../context/useChat'
import ProjectEmptyChatView from './ProjectEmptyChatView'

function ChatPanel() {
  const { selectedProject, selectedChat, setSelectedChat, setProjects } = useChat()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendError, setSendError] = useState('')
  const [creatingSession, setCreatingSession] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const sessionId = selectedChat?.id
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
  }, [selectedChat?.id])

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight
  }, [messages])

  useEffect(() => {
    if (selectedChat?.id && inputRef.current) {
      inputRef.current.focus()
    }
  }, [selectedChat?.id])

  const sendQuestion = async () => {
    const question = input.trim()
    if (!question || !selectedProject || loading || creatingSession) return

    setSendError('')

    // Optimistic temp chat when no selectedChat
    let sessionToUse = selectedChat
    let tempId = null
    if (!selectedChat) {
      tempId = `temp-${Date.now()}`
      const tempChat = { id: tempId, title: question, isTemporary: true, project_id: selectedProject.id }
      // set selected chat immediately
      setSelectedChat(tempChat)
      // optimistic add to project list so sidebar shows it
      setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, chats: [tempChat, ...(p.chats || [])] } : p))
      sessionToUse = tempChat
    }

    const userMessage = { id: `u-${Date.now()}`, role: 'user', content: question }
    setMessages((list) => [...list, userMessage])
    setInput('')
    setSendError('')
    setLoading(true)
    setCreatingSession(false)

    try {
      // If session was temporary, create real session first
      if (tempId) {
        setCreatingSession(true)
        const createRes = await ChatAPI.createSession(selectedProject.id)
        const realChat = createRes.data
        // replace temp with real in selectedChat and projects
        setSelectedChat(realChat)
        setProjects((prev) => prev.map((p) => {
          if (p.id !== selectedProject.id) return p
          const withoutTemp = (p.chats || []).filter((c) => c.id !== tempId)
          return { ...p, chats: [realChat, ...withoutTemp] }
        }))
        sessionToUse = realChat
        setCreatingSession(false)
      }

      const response = await ChatAPI.sendMessage(sessionToUse.id, question)
      const assistant = response.data.message || response.data.assistant_message || response.data.assistant || { role: 'assistant', content: response.data.answer || response.data.response || '' }
      setMessages((list) => [...list.filter((item) => item.id !== userMessage.id), userMessage, assistant])
    } catch (error) {
      console.error('[Chat] Error sending message or creating chat:', error)
      // rollback if temp
      if (tempId) {
        setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, chats: (p.chats || []).filter((c) => c.id !== tempId) } : p))
        setSelectedChat(null)
      }
      const errorMessage = error?.response?.data?.error || error?.response?.data?.detail || 'Không thể gửi câu hỏi. Vui lòng thử lại.'
      setSendError(String(errorMessage))
    } finally {
      setLoading(false)
      setCreatingSession(false)
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-transparent">
      <div ref={containerRef} className="min-h-0 flex-1 overflow-y-auto px-8 py-7" data-testid="chat-scroll-container">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm backdrop-blur">
              {selectedProject ? selectedProject.name : 'No project selected'}
            </span>
          </div>

          <div className="space-y-4 pb-4">
            {!selectedChat && selectedProject && (
              <ProjectEmptyChatView project={selectedProject} input={input} setInput={setInput} onSubmit={sendQuestion} creating={creatingSession} />
            )}

            {!loading && selectedChat && messages.length === 0 && (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/80 px-6 py-10 text-center text-sm text-slate-500 shadow-sm backdrop-blur">
                Start a new conversation by asking a question.
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`${message.role === 'user'
                  ? 'ml-auto max-w-107.5 rounded-[1.4rem] bg-linear-to-br from-slate-950 to-slate-800 text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)]'
                  : 'max-w-107.5 rounded-[1.4rem] border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]'
                  } px-6 py-4`}
              >
                <div className="text-sm leading-7">{message.content}</div>
                {message.sources && message.sources.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="font-semibold uppercase tracking-[0.18em] text-slate-400">Sources</span>
                    {message.sources.map((source, index) => <span key={index} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{source.document_title || source.document_id}</span>)}
                  </div>
                )}
                {message.contexts && message.contexts.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                    <span className="font-semibold uppercase tracking-[0.18em] text-slate-400">Contexts</span>
                    {message.contexts.map((context) => <span key={context.id} className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{context.document_id}</span>)}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="max-w-107.5 rounded-[1.4rem] border border-slate-200 bg-white px-6 py-4 text-slate-900 shadow-[0_12px_30px_rgba(15,23,42,0.06)]" aria-live="polite" aria-label="Assistant is responding">
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

      <div className="sticky bottom-0 z-10 border-t border-slate-200/80 bg-white/75 px-8 py-6 backdrop-blur-xl">
        {sendError && (
          <div className="mx-auto mb-3 flex max-w-190 items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs text-rose-700 shadow-sm" role="alert">
            <AlertCircle size={14} />
            <span>{sendError}</span>
          </div>
        )}
        <div className="mx-auto flex max-w-190 items-center gap-2 rounded-3xl border border-slate-200 bg-white/90 p-2.5 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                sendQuestion()
              }
            }}
            type="text"
            placeholder="Ask the archive a specific question..."
            disabled={loading || creatingSession || !selectedProject}
            className="flex-1 bg-transparent px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button type="button" onClick={sendQuestion} disabled={loading || creatingSession || !selectedProject} aria-label="Send message" className="ml-1 grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-slate-950 via-slate-900 to-blue-900 text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition hover:scale-[1.02] disabled:scale-100 disabled:opacity-50">
            <Send size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChatPanel
