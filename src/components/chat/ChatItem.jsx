function ChatItem({ session, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all duration-200 ${active ? 'bg-slate-950 text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)]' : 'text-slate-700 hover:bg-slate-50'}`}
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl ${active ? 'bg-white/12 text-white' : 'bg-slate-900 text-white'}`}>
        {session?.title ? session.title.charAt(0).toUpperCase() : 'C'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate">{session?.title || 'New Chat'}</div>
        <div className={`text-[10px] ${active ? 'text-slate-300' : 'text-slate-500'}`}>
          {session?.updated_at ? new Date(session.updated_at).toLocaleDateString() : ''}
        </div>
      </div>
    </button>
  )
}

export default ChatItem