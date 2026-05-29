import { useEffect, useRef, useState } from 'react'
import { AlertCircle, ChevronDown, FileText, Send, Star } from 'lucide-react'
import { ChatAPI } from '../../api/client'
import { useChat } from '../../context/useChat'
import ProjectEmptyChatView from './ProjectEmptyChatView'

function ChatPanel() {
  const { selectedProject, selectedChat, setSelectedChat, setProjects } = useChat()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendError, setSendError] = useState('')
  const [evaluation, setEvaluation] = useState(null)
  const [evaluationRating, setEvaluationRating] = useState(0)
  const [evaluationComment, setEvaluationComment] = useState('')
  const [evaluationStatus, setEvaluationStatus] = useState('')
  const [evaluationEditorOpen, setEvaluationEditorOpen] = useState(false)
  const [savingEvaluation, setSavingEvaluation] = useState(false)
  const [creatingSession, setCreatingSession] = useState(false)
  // Bước 5: state chọn file
  const [selectedDocumentId, setSelectedDocumentId] = useState(null)
  const [docSelectorOpen, setDocSelectorOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const docSelectorRef = useRef(null)
  const skipSessionLoadRef = useRef(null)

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (docSelectorRef.current && !docSelectorRef.current.contains(e.target)) {
        setDocSelectorOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Reset file selection khi đổi chat
  useEffect(() => {
    setSelectedDocumentId(null)
    setDocSelectorOpen(false)
  }, [selectedChat?.id])

  useEffect(() => {
    const sessionId = selectedChat?.id
    if (!sessionId) {
      setMessages([])
      setSendError('')
      setEvaluation(null)
      setEvaluationRating(0)
      setEvaluationComment('')
      setEvaluationStatus('')
      setEvaluationEditorOpen(false)
      return undefined
    }
    if (selectedChat?.isTemporary) {
      return undefined
    }
    if (skipSessionLoadRef.current === sessionId) {
      skipSessionLoadRef.current = null
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
  }, [selectedChat?.id, selectedChat?.isTemporary])

  useEffect(() => {
    const sessionId = selectedChat?.id
    if (!sessionId || selectedChat?.isTemporary) return undefined

    let mounted = true
    setEvaluationStatus('')
    ChatAPI.getEvaluation(sessionId)
      .then((response) => {
        if (!mounted) return
        const item = (response.data.results || response.data || [])[0] || null
        setEvaluation(item)
        setEvaluationRating(item?.rating || 0)
        setEvaluationComment(item?.comment || '')
        setEvaluationEditorOpen(false)
      })
      .catch((error) => {
        console.error('[Chat] getEvaluation error:', error)
      })

    return () => {
      mounted = false
    }
  }, [selectedChat?.id, selectedChat?.isTemporary])

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
      setSelectedChat(tempChat)
      setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, chats: [tempChat, ...(p.chats || [])] } : p))
      sessionToUse = tempChat
    }

    const userMessage = { id: `u-${Date.now()}`, role: 'user', content: question }
    setMessages((list) => [...list, userMessage])
    setInput('')
    setLoading(true)
    setCreatingSession(false)

    // ID tạm cho streaming message
    const streamingId = `streaming-${Date.now()}`

    try {
      // Tạo session thật nếu đang dùng temp
      if (tempId) {
        setCreatingSession(true)
        const createRes = await ChatAPI.createSession(selectedProject.id)
        const realChat = createRes.data
        skipSessionLoadRef.current = realChat.id
        setSelectedChat(realChat)
        setProjects((prev) => prev.map((p) => {
          if (p.id !== selectedProject.id) return p
          const withoutTemp = (p.chats || []).filter((c) => c.id !== tempId)
          return { ...p, chats: [realChat, ...withoutTemp] }
        }))
        sessionToUse = realChat
        setCreatingSession(false)
      }

      // Thêm placeholder streaming message
      setMessages((list) => [...list, {
        id: streamingId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }])

      // Gọi stream API
      const res = await ChatAPI.sendMessageStream(sessionToUse.id, question, selectedDocumentId)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let completedSessionId = null

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() // giữ phần chưa hoàn chỉnh

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          if (!raw) continue
          try {
            const event = JSON.parse(raw)
            if (event.type === 'token') {
              // Append token vào streaming message
              setMessages((list) => list.map((m) =>
                m.id === streamingId
                  ? { ...m, content: m.content + event.content }
                  : m
              ))
            } else if (event.type === 'done') {
              completedSessionId = event.session_id || sessionToUse.id
              // Stream xong → finalize message (xoá flag isStreaming)
              setMessages((list) => list.map((m) =>
                m.id === streamingId
                  ? { ...m, id: event.message_id, isStreaming: false }
                  : m
              ))
            } else if (event.type === 'error') {
              setSendError(event.content || 'Có lỗi xảy ra.')
              setMessages((list) => list.filter((m) => m.id !== streamingId))
            }
          } catch {
            // ignore JSON parse errors
          }
        }
      }

      if (completedSessionId) {
        const refreshed = await ChatAPI.getSession(completedSessionId)
        const detail = refreshed.data
        setSelectedChat(detail)
        setMessages(detail.messages || [])
        setProjects((prev) => prev.map((p) => {
          if (p.id !== selectedProject.id) return p
          const withoutCurrent = (p.chats || []).filter((chat) => chat.id !== detail.id && chat.id !== tempId)
          return { ...p, chats: [detail, ...withoutCurrent] }
        }))
      }
    } catch (error) {
      console.error('[Chat] Stream error:', error)
      // Rollback temp session nếu có
      if (tempId) {
        setProjects((prev) => prev.map((p) => p.id === selectedProject.id ? { ...p, chats: (p.chats || []).filter((c) => c.id !== tempId) } : p))
        setSelectedChat(null)
      }
      // Xoá placeholder streaming
      setMessages((list) => list.filter((m) => m.id !== streamingId))
      const errorMessage = error?.message || 'Không thể gửi câu hỏi. Vui lòng thử lại.'
      setSendError(errorMessage)
    } finally {
      setLoading(false)
      setCreatingSession(false)
    }
  }

  // Danh sách documents trong chat hiện tại
  const chatDocuments = selectedChat?.documents || []

  const submitEvaluation = async () => {
    if (!selectedChat?.id || selectedChat?.isTemporary || !evaluationRating || savingEvaluation) return
    setSavingEvaluation(true)
    setEvaluationStatus('')
    try {
      const response = await ChatAPI.saveEvaluation({
        chat_session: selectedChat.id,
        rating: evaluationRating,
        accuracy_rating: evaluationRating,
        usefulness_rating: evaluationRating,
        grounding_rating: evaluationRating,
        comment: evaluationComment.trim(),
      })
      setEvaluation(response.data)
      setEvaluationEditorOpen(false)
      setEvaluationStatus(evaluation ? 'Đã cập nhật đánh giá.' : 'Đã lưu đánh giá.')
    } catch (error) {
      console.error('[Chat] saveEvaluation error:', error)
      setEvaluationStatus(error?.response?.data?.detail || 'Không thể lưu đánh giá.')
    } finally {
      setSavingEvaluation(false)
    }
  }

  // Tên file đang chọn để hiển thị trên nút
  const selectedDocLabel = selectedDocumentId
    ? (chatDocuments.find((d) => d.id === selectedDocumentId)?.title || `File #${selectedDocumentId}`)
    : 'Tất cả file'

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
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`${message.role === 'user'
                    ? 'max-w-[72%] rounded-[1.4rem] bg-linear-to-br from-slate-950 to-slate-800 text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)]'
                    : 'max-w-[72%] rounded-[1.4rem] border border-slate-200 bg-white text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)]'
                    } px-6 py-4`}
                >
                  <div className="text-sm leading-7 whitespace-pre-wrap">
                    {message.content ? (
                      <>
                        {message.content}
                        {message.isStreaming && (
                          <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-current align-middle opacity-80" />
                        )}
                      </>
                    ) : message.isStreaming ? (
                      <div className="flex items-center gap-2 text-slate-600" aria-live="polite" aria-label="Assistant is responding">
                        <span>Đang phản hồi</span>
                        <span className="flex items-center gap-1">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:0ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:150ms]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:300ms]" />
                        </span>
                      </div>
                    ) : null}
                  </div>
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
              </div>
            ))}

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

        {selectedChat && !selectedChat.isTemporary && (
          <div className="mx-auto mb-2 flex max-w-190 items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              {chatDocuments.length > 0 && (
                <>
                  <span className="text-[11px] font-medium text-slate-400">Hỏi về:</span>
                  <div className="relative" ref={docSelectorRef}>
                    <button
                      type="button"
                      onClick={() => setDocSelectorOpen((o) => !o)}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <FileText size={12} className="text-slate-400" />
                      <span className="max-w-[160px] truncate">{selectedDocLabel}</span>
                      <ChevronDown size={12} className={`text-slate-400 transition-transform ${docSelectorOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {docSelectorOpen && (
                      <div className="absolute bottom-full left-0 z-20 mb-1 min-w-[200px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
                        <button
                          type="button"
                          onClick={() => { setSelectedDocumentId(null); setDocSelectorOpen(false) }}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 ${!selectedDocumentId ? 'font-semibold text-blue-700' : 'text-slate-700'}`}
                        >
                          <FileText size={14} className="shrink-0 text-slate-400" />
                          <span>Tất cả file</span>
                        </button>
                        {chatDocuments.map((doc) => (
                          <button
                            key={doc.id}
                            type="button"
                            onClick={() => { setSelectedDocumentId(doc.id); setDocSelectorOpen(false) }}
                            className={`flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm transition hover:bg-slate-50 ${selectedDocumentId === doc.id ? 'font-semibold text-blue-700' : 'text-slate-700'}`}
                          >
                            <FileText size={14} className="shrink-0 text-slate-400" />
                            <span className="truncate">{doc.title}</span>
                            {doc.index_status && (
                              <span className={`ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${doc.index_status === 'indexed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {doc.index_status}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="relative flex shrink-0 justify-end">
              {evaluation && !evaluationEditorOpen ? (
                <button
                  type="button"
                  onClick={() => setEvaluationEditorOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 shadow-sm transition hover:bg-amber-100"
                  title="Sửa đánh giá cuộc trò chuyện"
                >
                  <Star size={12} fill="currentColor" />
                  <span>Đã đánh giá {evaluation.rating}/5</span>
                </button>
              ) : (
                <div className="flex max-w-[560px] flex-wrap items-center justify-end gap-2 rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 shadow-sm">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">Đánh giá</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setEvaluationRating(value)}
                        className={`grid h-7 w-7 place-items-center rounded-lg transition ${value <= evaluationRating ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
                        aria-label={`Đánh giá ${value} sao`}
                      >
                        <Star size={14} fill={value <= evaluationRating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                  <input
                    value={evaluationComment}
                    onChange={(event) => setEvaluationComment(event.target.value)}
                    placeholder="Nhận xét ngắn..."
                    className="w-44 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 outline-none placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={submitEvaluation}
                    disabled={!evaluationRating || savingEvaluation}
                    className="rounded-xl bg-slate-950 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {evaluation ? 'Cập nhật' : 'Lưu'}
                  </button>
                  {evaluation && (
                    <button
                      type="button"
                      onClick={() => setEvaluationEditorOpen(false)}
                      className="rounded-xl px-2 py-1.5 text-xs font-semibold text-slate-500 transition hover:bg-slate-100"
                    >
                      Thu gọn
                    </button>
                  )}
                </div>
              )}
            </div>
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
            placeholder={
              selectedDocumentId
                ? `Hỏi về "${selectedDocLabel}"...`
                : 'Ask the archive a specific question...'
            }
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

