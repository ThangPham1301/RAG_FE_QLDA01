import React from 'react'

export default function ProjectEmptyChatView({ project, input, setInput, onSubmit, creating }) {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="mb-6 text-center">
        <div className="mb-3 inline-flex items-center rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 shadow-sm backdrop-blur">
          Project workspace
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">{project?.name || 'Project'}</h2>
        <p className="mt-2 text-sm text-slate-500">Start a focused conversation for this project.</p>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-white/85 px-6 py-7 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-xl">
        <div className="mb-4 grid gap-2 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
            Ask about file contents, status, or context.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
            Keep the conversation scoped to this project.
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs text-slate-500">
            Attach files later if you need richer context.
          </div>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`New chat in ${project?.name || 'project'}...`}
          className="w-full min-h-[140px] resize-none rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-200/60"
          disabled={creating}
        />
        <div className="mt-4 flex justify-center">
          <button onClick={onSubmit} disabled={creating || !input.trim()} className="inline-flex items-center justify-center rounded-full bg-gradient-to-br from-slate-950 to-blue-950 px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)] transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60">
            {creating ? 'Creating...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
