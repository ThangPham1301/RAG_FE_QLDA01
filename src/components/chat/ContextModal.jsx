function ContextModal({ open, documents, onClose }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-md">
      <div className="max-h-[84vh] w-[min(92vw,760px)] overflow-hidden rounded-[28px] border border-slate-200 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl">
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50 px-6 py-5">
          <div>
            <h3 className="font-['Manrope'] text-sm font-bold text-slate-900">Context Files</h3>
            <p className="text-xs text-slate-500">Files attached to this chat (read-only)</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800">Close</button>
          </div>
        </div>

        <div className="max-h-[calc(84vh-84px)] overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            {documents.length > 0 ? (
              documents.map((document) => (
                <div key={document.id} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-sm shadow-sm">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-slate-900">{document.title}</div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{document.file_type || 'UNKNOWN'}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">{document.index_status || 'PENDING'}</span>
                      <span className={`rounded-full px-2 py-0.5 ${document.index_status === 'indexed' ? 'bg-emerald-50 text-emerald-700' : document.index_status === 'failed' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>
                        {document.index_status === 'indexed' ? 'READY' : document.index_status === 'failed' ? 'FAILED' : 'PROCESSING'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">No documents in this chat</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContextModal