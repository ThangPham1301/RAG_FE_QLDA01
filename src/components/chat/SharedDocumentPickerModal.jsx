import { useEffect, useState } from 'react'
import { FileText, RefreshCw, Share2, X } from 'lucide-react'
import { TeamsAPI } from '../../api/client'

function SharedDocumentPickerModal({ open, chatSessionId, onClose, onAttached }) {
  const [documents, setDocuments] = useState([])
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return

    setLoading(true)
    setError('')
    setSelectedDocumentIds([])
    TeamsAPI.sharedLibrary()
      .then((response) => {
        const data = response.data || {}
        setDocuments(data.shared_with_me || [])
      })
      .catch((err) => {
        console.error(err)
        setError('Cannot load documents shared with you.')
      })
      .finally(() => setLoading(false))
  }, [open])

  if (!open) return null

  const toggleDocument = (id) => {
    setSelectedDocumentIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ))
  }

  const attachSelected = async () => {
    if (!chatSessionId || selectedDocumentIds.length === 0) return

    try {
      setLoading(true)
      setError('')
      await TeamsAPI.attachDocumentsToChat(chatSessionId, selectedDocumentIds)
      onAttached && onAttached()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.detail || err?.response?.data?.error || 'Cannot attach documents.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
              <Share2 size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add from Shared with me</h2>
              <p className="text-xs text-slate-500">Attach documents that other users shared directly with you.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200">
            {loading && (
              <div className="flex items-center gap-2 px-4 py-8 text-sm text-slate-500">
                <RefreshCw size={15} className="animate-spin" />
                Loading...
              </div>
            )}
            {!loading && documents.length === 0 && (
              <div className="px-4 py-8 text-sm text-slate-500">No documents have been shared with you.</div>
            )}
            {!loading && documents.map((doc) => (
              <label key={doc.id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedDocumentIds.includes(doc.id)}
                  onChange={() => toggleDocument(doc.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700"
                />
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <FileText size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800">{doc.title}</span>
                  <span className="text-xs text-slate-500">{doc.index_status || 'pending'}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={attachSelected}
            disabled={loading || selectedDocumentIds.length === 0}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Attach {selectedDocumentIds.length || ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SharedDocumentPickerModal
