import ChatItem from './ChatItem'

function ChatList({ sessions, activeSessionId, onSelect }) {
  return (
    <div className="space-y-2">
      <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Chats</div>

      <div className="space-y-1">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <ChatItem
              key={session.id}
              session={session}
              active={activeSessionId === session.id}
              onClick={() => onSelect(session)}
            />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-3 py-3 text-sm text-slate-500">No chats yet</div>
        )}
      </div>
    </div>
  )
}

export default ChatList