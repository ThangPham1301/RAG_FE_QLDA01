import { useEffect, useRef, useState } from 'react'
import { AlertCircle, CheckCircle2, Loader2, Paperclip } from 'lucide-react'
import { ChatAPI, DocumentsAPI } from '../../api/client'
import { useChat } from '../../context/useChat'

function ChatPanel() {
  const { selectedProject, currentSession, selectedDocumentIds, setDocumentsRefreshToken } = useChat()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ phase: 'idle', message: '' })
  const [sendError, setSendError] = useState('')
  const containerRef = useRef(null)
  const fileInputRef = useRef(null)
  const inputRef = useRef(null)

  const buildUploadResultMessage = (responseData) => {
    const docs = responseData?.documents || (responseData?.document ? [responseData.document] : [])
    if (!docs.length) return 'Upload hoàn tất.'
    const indexedCount = docs.filter((document) => document.index_status === 'indexed').length
    const failedCount = docs.filter((document) => document.index_status === 'failed').length
    if (failedCount > 0) return `Đã tải ${docs.length} file, ${failedCount} file index lỗi.`
    if (indexedCount === docs.length) return `Đã tải lên và index ${indexedCount} file.`
    return `Đã tải ${docs.length} file, đang xử lý index thêm.`
  }

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
      const response = await ChatAPI.sendMessage(currentSession.id, question, selectedDocumentIds)
      const assistant = response.data.message || response.data.assistant_message || response.data.assistant || { role: 'assistant', content: response.data.answer || response.data.response || '' }
      setMessages((list) => [...list.filter((item) => item.id !== userMessage.id), userMessage, assistant])
    } catch (error) {
      console.error('[Chat] Error sending message:', error)
      if (error.response) {
        console.error('[Chat] Error status:', error.response.status)
        console.error('[Chat] Error data:', error.response.data)
      }
      const errorMessage = error?.response?.data?.error || error?.response?.data?.detail || 'Không thể gửi câu hỏi. Vui lòng thử lại.'
      setSendError(String(errorMessage))
    } finally {
      setLoading(false)
    }
  }

  const uploadFiles = async (files) => {
    if (!selectedProject || !files || files.length === 0) return
    const formData = new FormData()
    for (const file of files) formData.append('files', file)
    let phaseTimer = null
    try {
      setUploading(true)
      setUploadStatus({ phase: 'uploading', message: 'Đang tải file lên...' })
      phaseTimer = setTimeout(() => {
        setUploadStatus({ phase: 'indexing', message: 'Đang index file để có thể hỏi đáp...' })
      }, 900)
      const response = await DocumentsAPI.upload(selectedProject.id, formData)
      if (phaseTimer) clearTimeout(phaseTimer)
      setUploadStatus({ phase: 'success', message: buildUploadResultMessage(response.data) })
      setDocumentsRefreshToken((value) => value + 1)
    } catch (error) {
      console.error(error)
      if (phaseTimer) clearTimeout(phaseTimer)
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.message || 'Upload failed'
      setUploadStatus({ phase: 'error', message: String(errorMessage) })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <section className="flex h-full min-h-0 flex-1 flex-col bg-[#f8f9ff]">
      <div ref={containerRef} className="min-h-0 flex-1 overflow-y-auto px-8 py-6">
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
        {(uploading || uploadStatus.phase === 'success' || uploadStatus.phase === 'error') && (
          <div className={`mx-auto mb-3 flex max-w-190 items-center gap-2 rounded-xl border px-3 py-2 text-xs ${uploadStatus.phase === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : uploadStatus.phase === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
            {(uploadStatus.phase === 'uploading' || uploadStatus.phase === 'indexing') && <Loader2 size={14} className="animate-spin" />}
            {uploadStatus.phase === 'success' && <CheckCircle2 size={14} />}
            {uploadStatus.phase === 'error' && <AlertCircle size={14} />}
            <span>{uploadStatus.message}</span>
          </div>
        )}
        {sendError && (
          <div className="mx-auto mb-3 flex max-w-190 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700" role="alert">
            <AlertCircle size={14} />
            <span>{sendError}</span>
          </div>
        )}
        <div className="mx-auto flex max-w-190 items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <input ref={fileInputRef} type="file" multiple hidden onChange={(event) => uploadFiles(event.target.files)} />
          <button
            type="button"
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={!selectedProject || uploading}
            className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            title="Upload files"
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
          </button>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            type="text"
            placeholder="Ask the archive a specific question..."
            disabled={loading}
            className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <div className="hidden items-center gap-2 lg:flex">
            <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">Context: {selectedDocumentIds.length} file(s)</span>
          </div>
          <button type="button" onClick={sendQuestion} disabled={loading || !currentSession} className="ml-1 grid h-10 w-10 place-items-center rounded-xl bg-linear-to-r from-black to-blue-950 shadow-sm disabled:opacity-50">
            <span className="h-3 w-3 rounded-sm bg-white" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChatPanel