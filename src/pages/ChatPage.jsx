import ChatPanel from '../components/chat/ChatPanel'
import ChatSidebar from '../components/layout/ChatSidebar'
import ChatTopBar from '../components/layout/ChatTopBar'

function ChatPage() {
  return (
    <main className="h-screen overflow-hidden bg-white">
      <div className="flex h-full">
        <ChatSidebar />

        <div className="ml-64 flex h-full min-h-0 min-w-0 flex-1 flex-col">
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