function ChatItem({ session, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm transition ${active ? 'bg-[#e5eeff] font-semibold text-blue-800' : 'text-slate-700 hover:bg-white/70'}`}
    >
      <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${active ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'}`}>
        {session?.title ? session.title.charAt(0).toUpperCase() : 'C'}
      </span>
      <div className="min-w-0 flex-1">
        <div className="truncate">{session?.title || 'New Chat'}</div>
        <div className="text-[10px] text-slate-500">
          {session?.updated_at ? new Date(session.updated_at).toLocaleDateString() : ''}
        </div>
      </div>
    </button>
  )
}

export default ChatItem