import ChatPanel from '../components/chat/ChatPanel'
import ChatSidebar from '../components/layout/ChatSidebar'
import ChatTopBar from '../components/layout/ChatTopBar'

function ChatPage() {
  return (
    <main className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <div className="flex h-full">
        <ChatSidebar />

        <div className="ml-64 flex h-full min-h-0 min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_right,_rgba(186,230,253,0.35),_transparent_28%),linear-gradient(180deg,_rgba(248,250,252,0.98),_rgba(255,255,255,0.95))]">
          <ChatTopBar />
          <div className="flex min-h-0 flex-1">
            <ChatPanel />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ChatPage