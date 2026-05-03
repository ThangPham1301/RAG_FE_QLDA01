import { useState } from 'react'
import topbarAvatar from '../assets/account/topbar-avatar.png'
import AccountActivityLogPanel from '../components/layout/AccountActivityLogPanel'
import AccountFooterActions from '../components/layout/AccountFooterActions'
import AccountHeader from '../components/layout/AccountHeader'
import AccountPreferencesGrid from '../components/layout/AccountPreferencesGrid'
import AccountProfileCard from '../components/layout/AccountProfileCard'
import AccountSecurityPanel from '../components/layout/AccountSecurityPanel'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import EditProfileModal from '../components/layout/EditProfileModal'
import ChangePasswordModal from '../components/layout/ChangePasswordModal'
import { useAuth } from '../context/AuthContext'

function AccountPage() {
    const { user } = useAuth()
    const [editProfileOpen, setEditProfileOpen] = useState(false)
    const [changePasswordOpen, setChangePasswordOpen] = useState(false)
    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ArchiveSidebar activeItem="Settings" ctaLabel="NEW RESEARCH" />

                <div className="flex min-h-screen flex-1 flex-col">
                    <WorkspaceTopBar
                        placeholder="Search archive..."
                        profileName="Dr. Elias Vance"
                        profileRole="Senior Research Fellow"
                        avatarSrc={topbarAvatar}
                    />

                    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-5">
                            <AccountHeader />

                            <div className="grid gap-5 xl:grid-cols-[1.15fr_1fr]">
                                <AccountProfileCard 
                                    onEditProfileClick={() => setEditProfileOpen(true)}
                                    onEditAvatarClick={() => setEditProfileOpen(true)}
                                />
                                <AccountSecurityPanel onChangePasswordClick={() => setChangePasswordOpen(true)} />
                            </div>

                            <AccountActivityLogPanel />
                            <AccountPreferencesGrid />
                            <AccountFooterActions />
                        </div>
                    </div>
                </div>
            </div>

            <EditProfileModal
                isOpen={editProfileOpen}
                onClose={() => setEditProfileOpen(false)}
                user={user}
                onSuccess={() => setEditProfileOpen(false)}
            />

            <ChangePasswordModal
                isOpen={changePasswordOpen}
                onClose={() => setChangePasswordOpen(false)}
                onSuccess={() => setChangePasswordOpen(false)}
            />
        </main>
    )
}

export default AccountPage
