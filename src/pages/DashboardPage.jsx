import avatarProfile from '../assets/dashboard/avatar-profile.png'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import DashboardActiveSessionCard from '../components/layout/DashboardActiveSessionCard'
import DashboardHeader from '../components/layout/DashboardHeader'
import DashboardInsightsPanel from '../components/layout/DashboardInsightsPanel'
import DashboardMetricsGrid from '../components/layout/DashboardMetricsGrid'
import DashboardRecentActivityPanel from '../components/layout/DashboardRecentActivityPanel'
import DashboardUploadVelocityPanel from '../components/layout/DashboardUploadVelocityPanel'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

function DashboardPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ArchiveSidebar activeItem="Dashboard" ctaLabel="NEW RESEARCH" />

                <div className="flex min-h-screen flex-1 flex-col">
                    <WorkspaceTopBar
                        placeholder="Search archive..."
                        profileName="Dr. Aris Thorne"
                        profileRole="Lead Researcher"
                        avatarSrc={avatarProfile}
                    />

                    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-5">
                            <DashboardHeader />
                            <DashboardMetricsGrid />

                            <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
                                <DashboardRecentActivityPanel />
                                <DashboardUploadVelocityPanel />
                            </div>

                            <DashboardActiveSessionCard />
                            <DashboardInsightsPanel />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardPage
