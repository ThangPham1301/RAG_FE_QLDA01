import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Settings, X, SmilePlus } from 'lucide-react'

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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-170 rounded-3xl border border-white/10 bg-[#222222] px-6 py-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.5)]"
      >
        <div className="flex items-start justify-between gap-3">
          <h2 className="rounded-lg text-[34px] font-medium leading-none tracking-[-0.04em] text-white">Create project</h2>

          <div className="flex items-center gap-4 text-white">
            <button
              type="button"
              className="rounded-full p-1 text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Settings"
            >
              <Settings size={22} strokeWidth={1.8} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1 text-white/90 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <X size={22} strokeWidth={1.8} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          <label htmlFor="project-name" className="mb-3 block text-xl font-medium text-white">
            Project name
          </label>

          <div className="flex items-center rounded-2xl border border-white/10 bg-[#2b2b2b] px-4 py-3.5 shadow-inner shadow-black/20">
            <SmilePlus size={22} className="mr-3 shrink-0 text-white/55" strokeWidth={1.8} />
            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoFocus
              placeholder="Copenhagen Trip"
              disabled={loading}
              className="w-full bg-transparent text-xl text-white outline-none placeholder:text-white/35 disabled:opacity-60"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={!name.trim() || loading}
            className="min-w-40 rounded-full bg-[#6a6a6a] px-5 py-3 text-[16px] font-medium text-[#1a1a1a] shadow-[0_10px_24px_rgba(0,0,0,0.25)] transition disabled:cursor-not-allowed disabled:opacity-70"
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