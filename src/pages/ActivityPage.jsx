import topbarAvatar from '../assets/activity/topbar-avatar.png'
import ActivityFeed from '../components/layout/ActivityFeed'
import ActivityHeader from '../components/layout/ActivityHeader'
import ActivityRightPanel from '../components/layout/ActivityRightPanel'
import ActivityStatsGrid from '../components/layout/ActivityStatsGrid'
import ActivityTabs from '../components/layout/ActivityTabs'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

function ActivityPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ArchiveSidebar activeItem="Analytics" ctaLabel="NEW RESEARCH" />

                <div className="flex min-h-screen flex-1 flex-col">
                    <WorkspaceTopBar
                        placeholder="Search archive..."
                        profileName="Dr. Elena Ross"
                        profileRole="Principal Researcher"
                        avatarSrc={topbarAvatar}
                    />

                    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-5">
                            <ActivityHeader />
                            <ActivityTabs />
                            <ActivityStatsGrid />

                            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                                <ActivityFeed />
                                <ActivityRightPanel />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default ActivityPage
