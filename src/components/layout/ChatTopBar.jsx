import avatarElias from '../../assets/chat/avatar-elias.png'
import WorkspaceTopBar from './WorkspaceTopBar'

function ChatTopBar() {
  return (
    <WorkspaceTopBar
      profileName="Dr. Elias Vance"
      profileRole="Policy Specialist"
      avatarSrc={avatarElias}
    />
  )
}

export default ChatTopBar
