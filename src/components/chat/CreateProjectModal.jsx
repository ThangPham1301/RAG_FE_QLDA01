import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { FolderPlus, X } from 'lucide-react'

function CreateProjectModal({ open, onClose, onCreate, loading }) {
  const [name, setName] = useState('')

  useEffect(() => {
    if (!open) {
      setName('')
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) return null

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName || loading) return
    await onCreate(trimmedName)
    setName('')
  }

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white px-6 py-5 text-slate-900 shadow-[0_24px_80px_rgba(15,23,42,0.24)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-['Manrope'] text-2xl font-extrabold leading-tight text-slate-950">Create project</h2>
            <p className="mt-1 text-sm text-slate-500">Add a workspace for chats and documents.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close"
            >
              <X size={18} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="project-name" className="mb-2 block text-sm font-semibold text-slate-800">
            Project name
          </label>

          <div className="flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2.5 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100">
            <FolderPlus size={18} className="mr-2.5 shrink-0 text-slate-400" strokeWidth={1.8} />
            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              placeholder="Copenhagen Trip"
              disabled={loading}
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create project'}
          </button>
        </div>
      </form>
    </div>,
    document.body,
  )
}

export default CreateProjectModal
