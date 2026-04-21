import avatarElias from '../../assets/chat/avatar-elias.png'
import WorkspaceTopBar from './WorkspaceTopBar'

function ChatTopBar() {
  return (
    <WorkspaceTopBar
      placeholder="Search archive or chat history..."
      profileName="Dr. Elias Vance"
      profileRole="Policy Specialist"
      avatarSrc={avatarElias}
    />
  )
}

export default ChatTopBar