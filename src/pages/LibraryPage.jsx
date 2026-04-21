import topbarAvatar from '../assets/library/topbar-avatar.png'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import LibraryDocumentPanel from '../components/layout/LibraryDocumentPanel'
import LibraryHeader from '../components/layout/LibraryHeader'
import LibraryStatsGrid from '../components/layout/LibraryStatsGrid'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

function LibraryPage() {
    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ArchiveSidebar activeItem="Library" ctaLabel="NEW RESEARCH" />

                <div className="flex min-h-screen flex-1 flex-col">
                    <WorkspaceTopBar
                        placeholder="Search archive..."
                        profileName="Dr. Sarah Chen"
                        profileRole="Senior Researcher"
                        avatarSrc={topbarAvatar}
                    />

                    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-5">
                            <LibraryHeader />
                            <LibraryStatsGrid />
                            <LibraryDocumentPanel />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LibraryPage
