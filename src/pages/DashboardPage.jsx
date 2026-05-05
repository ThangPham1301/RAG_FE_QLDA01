import { Database, FilePlus2, Files, FolderSync, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import avatarProfile from '../assets/dashboard/avatar-profile.png'
import { StatisticsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import DashboardActiveSessionCard from '../components/layout/DashboardActiveSessionCard'
import DashboardHeader from '../components/layout/DashboardHeader'
import DashboardInsightsPanel from '../components/layout/DashboardInsightsPanel'
import DashboardMetricsGrid from '../components/layout/DashboardMetricsGrid'
import DashboardRecentActivityPanel from '../components/layout/DashboardRecentActivityPanel'
import DashboardUploadVelocityPanel from '../components/layout/DashboardUploadVelocityPanel'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

const formatTimeAgo = (value) => {
    if (!value) return '—'
    const uploadedAt = new Date(value).getTime()
    if (Number.isNaN(uploadedAt)) return '—'
    const diffMinutes = Math.max(1, Math.floor((Date.now() - uploadedAt) / 60000))
    if (diffMinutes < 60) return `${diffMinutes} PHÚT TRƯỚC`
    const diffHours = Math.floor(diffMinutes / 60)
    if (diffHours < 24) return `${diffHours} GIỜ TRƯỚC`
    return `${Math.floor(diffHours / 24)} NGÀY TRƯỚC`
}

function DashboardPage() {
    const [stats, setStats] = useState(null)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true
        StatisticsAPI.overview()
            .then((response) => {
                if (!mounted) return
                setStats(response.data)
                setError('')
            })
            .catch(() => {
                if (!mounted) return
                setError('Không thể tải dữ liệu thống kê.')
            })
        return () => {
            mounted = false
        }
    }, [])

    const metrics = useMemo(() => {
        const data = stats || {}
        return [
            {
                title: 'TOTAL DOCUMENTS',
                value: String(data.total_documents ?? 0),
                badge: `${data.total_projects ?? 0} project(s)`,
                badgeTone: 'blue',
                icon: <Files size={18} />,
            },
            {
                title: 'INDEXED DOCUMENTS',
                value: String(data.indexed_documents ?? 0),
                badge: data.failed_documents ? `${data.failed_documents} failed` : 'Healthy',
                badgeTone: data.failed_documents ? 'amber' : 'emerald',
                icon: <Database size={18} />,
            },
            {
                title: 'ACTIVE CHATS',
                value: String(data.active_chat_sessions ?? 0),
                badge: `${data.indexing_documents ?? 0} indexing`,
                badgeTone: 'blue',
                icon: <FolderSync size={18} />,
            },
            {
                title: 'INDEXED CHUNKS',
                value: String(data.total_indexed_chunks ?? 0),
                badge: 'RAG READY',
                badgeTone: 'emerald',
                icon: <ShieldAlert size={18} />,
            },
        ]
    }, [stats])

    const activities = useMemo(() => {
        const uploads = stats?.recent_uploads || []
        if (!uploads.length) {
            return [{
                title: 'No recent uploads',
                description: 'Chưa có hoạt động upload tài liệu gần đây.',
                timestamp: 'NOW',
                icon: <FilePlus2 size={16} />,
            }]
        }
        return uploads.map((item) => ({
            title: item.title,
            description: `${item.project_name}${item.chat_session_title ? ` • ${item.chat_session_title}` : ''}`,
            timestamp: formatTimeAgo(item.uploaded_at),
            icon: <FilePlus2 size={16} />,
        }))
    }, [stats])

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
                            {error && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </div>
                            )}
                            <DashboardMetricsGrid metrics={metrics} />

                            <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
                                <DashboardRecentActivityPanel activities={activities} />
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
