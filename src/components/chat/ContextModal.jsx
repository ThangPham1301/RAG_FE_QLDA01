import { AlertCircle, CheckCircle2 } from 'lucide-react'

function ContextModal({ open, documents, selectedDocumentIds, onToggle, onClose, onClear }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="max-h-[84vh] w-[min(92vw,760px)] overflow-hidden rounded-2xl border border-blue-100 bg-white/95 shadow-lg backdrop-blur">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h3 className="font-['Manrope'] text-sm font-bold text-slate-900">Context Files</h3>
            <p className="text-xs text-slate-500">Choose files used as default retrieval scope</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClear} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">Clear</button>
            <button type="button" onClick={onClose} className="rounded-lg bg-blue-950 px-3 py-2 text-xs font-semibold text-white shadow-sm">Close</button>
          </div>
        </div>

        <div className="max-h-[calc(84vh-84px)] overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((document) => {
                const checked = selectedDocumentIds.includes(document.id)
                return (
                  <label key={document.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 text-sm transition ${checked ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'}`}>
                    <input type="checkbox" checked={checked} onChange={() => onToggle(document.id)} className="mt-1" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium text-slate-900">{document.title}</div>
                      <div className="mt-1 flex flex-wrap gap-2 text-[10px] font-semibold">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{document.file_type || 'UNKNOWN'}</span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{document.index_status || 'PENDING'}</span>
                        <span className={`rounded-full px-2 py-0.5 ${document.index_status === 'indexed' ? 'bg-emerald-50 text-emerald-700' : document.index_status === 'failed' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                          {document.index_status === 'indexed' ? 'READY' : document.index_status === 'failed' ? 'FAILED' : 'PROCESSING'}
                        </span>
                      </div>
                    </div>
                    {checked ? <CheckCircle2 size={14} className="mt-1 text-emerald-600" /> : <AlertCircle size={14} className="mt-1 text-slate-400" />}
                  </label>
                )
              })
            ) : (
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">No documents in project</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContextModal