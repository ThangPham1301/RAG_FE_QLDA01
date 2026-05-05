import ChatItem from './ChatItem'

function ChatList({ sessions, activeSessionId, onSelect }) {
  return (
    <div className="space-y-2">
      <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Chats</div>

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
          <div className="px-2 py-2 text-sm text-slate-600">No chats yet</div>
        )}
      </div>
    </div>
  )
}

export default ChatList