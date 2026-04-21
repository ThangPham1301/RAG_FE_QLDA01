import topbarAvatar from '../assets/account/topbar-avatar.png'
import AccountActivityLogPanel from '../components/layout/AccountActivityLogPanel'
import AccountFooterActions from '../components/layout/AccountFooterActions'
import AccountHeader from '../components/layout/AccountHeader'
import AccountPreferencesGrid from '../components/layout/AccountPreferencesGrid'
import AccountProfileCard from '../components/layout/AccountProfileCard'
import AccountSecurityPanel from '../components/layout/AccountSecurityPanel'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

function AccountPage() {
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
                                <AccountProfileCard />
                                <AccountSecurityPanel />
                            </div>

                            <AccountActivityLogPanel />
                            <AccountPreferencesGrid />
                            <AccountFooterActions />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AccountPage
