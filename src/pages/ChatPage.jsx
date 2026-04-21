import ChatConversationPanel from '../components/layout/ChatConversationPanel'
import ChatSidebar from '../components/layout/ChatSidebar'
import ChatTopBar from '../components/layout/ChatTopBar'
import SourceContextPanel from '../components/layout/SourceContextPanel'

function ChatPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <ChatSidebar />

        <div className="flex min-h-screen flex-1 flex-col">
          <ChatTopBar />
          <div className="flex min-h-0 flex-1">
            <ChatConversationPanel />
            <SourceContextPanel />
          </div>
        </div>
      </div>
    </main>
  )
}

export default ChatPage