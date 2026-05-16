import { Database, FilePlus2, Files, FolderSync, ShieldAlert } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import avatarProfile from '../assets/dashboard/avatar-profile.png'
import { StatisticsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import DashboardMetricsGrid from '../components/layout/DashboardMetricsGrid'
import DashboardRecentActivityPanel from '../components/layout/DashboardRecentActivityPanel'
import DashboardStatusDistributionPanel from '../components/layout/DashboardStatusDistributionPanel'
import DashboardUploadVelocityPanel from '../components/layout/DashboardUploadVelocityPanel'
import DashboardChartsPanel from '../components/layout/DashboardChartsPanel'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

const getNumber = (source, ...keys) => {
    for (const key of keys) {
        const value = source?.[key]
        if (typeof value === 'number' && Number.isFinite(value)) return value
        if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value)
    }
    return 0
}

const getList = (source, ...keys) => {
    for (const key of keys) {
        const value = source?.[key]
        if (Array.isArray(value)) return value
    }
    return []
}

const normalizeOverview = (responseData) => {
    const source = responseData?.data || responseData?.summary || responseData || {}
    const charts = responseData?.charts || {}
    return {
        totalDocuments: getNumber(source, 'total_documents', 'totalDocuments'),
        indexedDocuments: getNumber(source, 'indexed_documents', 'indexedDocuments'),
        failedDocuments: getNumber(source, 'failed_documents', 'failedDocuments'),
        indexingDocuments: getNumber(source, 'indexing_documents', 'indexingDocuments'),
        activeChatSessions: getNumber(source, 'active_chat_sessions', 'activeChatSessions'),
        totalIndexedChunks: getNumber(source, 'total_indexed_chunks', 'totalIndexedChunks'),
        totalProjects: getNumber(source, 'total_projects', 'totalProjects'),
        recentUploads: getList(source, 'recent_uploads', 'recentUploads', 'activities'),
        chartData: getList(charts, 'line') || [],
    }
}

const toDayLabel = (dateValue) => {
    const date = new Date(dateValue)
    if (Number.isNaN(date.getTime())) return 'N/A'
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
}

const buildUploadBars = (uploads = []) => {
    const byDay = new Map()
    uploads.forEach((item) => {
        const sourceDate = item.uploaded_at || item.created_at
        const key = toDayLabel(sourceDate)
        const isIndexed = ['indexed', 'ready'].includes(String(item.index_status || item.status || '').toLowerCase())
        const current = byDay.get(key) || { label: key, uploads: 0, indexed: 0, timestamp: new Date(sourceDate).getTime() || 0 }
        current.uploads += 1
        if (isIndexed) current.indexed += 1
        byDay.set(key, current)
    })
    return Array.from(byDay.values())
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(-7)
        .map(({ label, uploads: totalUploads, indexed }) => ({ label, uploads: totalUploads, indexed }))
}

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
    const [isLoading, setIsLoading] = useState(true)
    const [isExporting, setIsExporting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        let mounted = true
        setIsLoading(true)
        StatisticsAPI.overview()
            .then((response) => {
                if (!mounted) return
                setStats(normalizeOverview(response.data))
                setError('')
            })
            .catch(() => {
                if (!mounted) return
                setError('Không thể tải dữ liệu thống kê.')
            })
            .finally(() => {
                if (mounted) setIsLoading(false)
            })
        return () => {
            mounted = false
        }
    }, [])

    const handleExportReport = async () => {
        setIsExporting(true)
        setError('')
        try {
            const response = await StatisticsAPI.export({}, 'csv')
            const blob = response.data
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `statistics-${new Date().toISOString().slice(0, 10)}.csv`
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch {
            setError('Không thể export báo cáo thống kê.')
        } finally {
            setIsExporting(false)
        }
    }

    const metrics = useMemo(() => {
        const data = stats || {}
        return [
            {
                title: 'TOTAL DOCUMENTS',
                value: String(data.totalDocuments ?? 0),
                badge: `${data.totalProjects ?? 0} project(s)`,
                badgeTone: 'blue',
                icon: <Files size={18} />,
            },
            {
                title: 'INDEXED DOCUMENTS',
                value: String(data.indexedDocuments ?? 0),
                badge: data.failedDocuments ? `${data.failedDocuments} failed` : 'Healthy',
                badgeTone: data.failedDocuments ? 'amber' : 'emerald',
                icon: <Database size={18} />,
            },
            {
                title: 'ACTIVE CHATS',
                value: String(data.activeChatSessions ?? 0),
                badge: `${data.indexingDocuments ?? 0} indexing`,
                badgeTone: 'blue',
                icon: <FolderSync size={18} />,
            },
            {
                title: 'INDEXED CHUNKS',
                value: String(data.totalIndexedChunks ?? 0),
                badge: 'RAG READY',
                badgeTone: 'emerald',
                icon: <ShieldAlert size={18} />,
            },
        ]
    }, [stats])

    const activities = useMemo(() => {
        const uploads = stats?.recentUploads || []
        if (!uploads.length) {
            return [{
                title: 'No recent uploads',
                description: 'Chưa có hoạt động upload tài liệu gần đây.',
                timestamp: 'NOW',
                icon: <FilePlus2 size={16} />,
            }]
        }
        return uploads.map((item) => ({
            id: item.id || item.document_id,
            title: item.title || item.file_name || item.filename || 'Uploaded document',
            description: `${item.project_name || item.project?.name || 'Unknown project'}${item.chat_session_title || item.chat_session?.title ? ` • ${item.chat_session_title || item.chat_session?.title}` : ''}`,
            timestamp: formatTimeAgo(item.uploaded_at || item.created_at),
            icon: <FilePlus2 size={16} />,
        }))
    }, [stats])

    const uploadBars = useMemo(() => buildUploadBars(stats?.recentUploads || []), [stats])

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
                            <DashboardHeader onExport={handleExportReport} isExporting={isExporting} />
                            {error && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                                    {error}
                                </div>
                            )}
                            <DashboardMetricsGrid metrics={metrics} />
                            <div className="grid gap-5 xl:grid-cols-[1.25fr_1fr]">
                                <DashboardRecentActivityPanel activities={activities} isLoading={isLoading} />
                                <DashboardStatusDistributionPanel
                                    total={stats?.totalDocuments || 0}
                                    indexed={stats?.indexedDocuments || 0}
                                    failed={stats?.failedDocuments || 0}
                                    indexing={stats?.indexingDocuments || 0}
                                />
                            </div>
                            <DashboardUploadVelocityPanel bars={uploadBars} />
                            <DashboardChartsPanel data={stats?.chartData || []} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardPage
