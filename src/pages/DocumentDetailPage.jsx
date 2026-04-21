import topbarAvatar from '../assets/document/topbar-avatar.png'
import AnalysisPipelinePanel from '../components/layout/AnalysisPipelinePanel'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import DocumentAIPanel from '../components/layout/DocumentAIPanel'
import DocumentBreadcrumb from '../components/layout/DocumentBreadcrumb'
import DocumentHeader from '../components/layout/DocumentHeader'
import DocumentMetricsPanel from '../components/layout/DocumentMetricsPanel'
import DocumentViewerPanel from '../components/layout/DocumentViewerPanel'
import VisualIndexPanel from '../components/layout/VisualIndexPanel'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

function DocumentDetailPage() {
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
                            <DocumentBreadcrumb />
                            <DocumentHeader />

                            <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                                <div className="space-y-5">
                                    <DocumentViewerPanel />
                                    <AnalysisPipelinePanel />
                                    <DocumentMetricsPanel />
                                    <VisualIndexPanel />
                                </div>
                                <DocumentAIPanel />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DocumentDetailPage
