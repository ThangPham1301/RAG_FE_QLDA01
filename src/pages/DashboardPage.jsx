import { Activity, Database, Files, FolderSync, ShieldAlert, TrendingUp, UploadCloud, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import avatarProfile from '../assets/dashboard/avatar-profile.png'
import { StatisticsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import DashboardHeader from '../components/layout/DashboardHeader'
import DashboardMetricsGrid from '../components/layout/DashboardMetricsGrid'
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
    const summary = responseData?.summary || {}
    const charts = responseData?.charts || {}
    return {
        totalDocuments: getNumber(source, 'total_documents', 'totalDocuments'),
        indexedDocuments: getNumber(source, 'indexed_documents', 'indexedDocuments'),
        failedDocuments: getNumber(source, 'failed_documents', 'failedDocuments'),
        indexingDocuments: getNumber(source, 'indexing_documents', 'indexingDocuments'),
        activeChatSessions: getNumber(source, 'active_chat_sessions', 'activeChatSessions'),
        totalIndexedChunks: getNumber(source, 'total_indexed_chunks', 'totalIndexedChunks'),
        totalProjects: getNumber(source, 'total_projects', 'totalProjects'),
        // Summary counters from the aggregated summary block
        totalUsers: getNumber(summary, 'users'),
        totalVisits: getNumber(summary, 'visits'),
        totalQueries: getNumber(summary, 'queries'),
        // chart_rows include: period, users, visits, queries, uploads
        chartData: getList(charts, 'line', 'bar') || [],
    }
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

    const handleExportReport = async (format = 'csv') => {
        setIsExporting(true)
        setError('')
        try {
            const response = await StatisticsAPI.export({}, format)
            const blob = response.data
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `statistics-${new Date().toISOString().slice(0, 10)}.${format}`
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
            {
                title: 'NGƯỜI DÙNG',
                value: String(data.totalUsers ?? 0),
                badge: 'Trong kỳ',
                badgeTone: 'blue',
                icon: <Users size={18} />,
            },
            {
                title: 'LƯỢT TRUY CẬP',
                value: String(data.totalVisits ?? 0),
                badge: 'Sessions',
                badgeTone: 'emerald',
                icon: <Activity size={18} />,
            },
            {
                title: 'TRUY VẤN RAG',
                value: String(data.totalQueries ?? 0),
                badge: 'Câu hỏi',
                badgeTone: 'blue',
                icon: <TrendingUp size={18} />,
            },
            {
                title: 'FILE UPLOAD',
                value: String(data.totalDocuments ?? 0),
                badge: `${data.indexedDocuments ?? 0} indexed`,
                badgeTone: 'emerald',
                icon: <UploadCloud size={18} />,
            },
        ]
    }, [stats])

    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ArchiveSidebar activeItem="Dashboard" ctaLabel="NEW RESEARCH" />

                <div className="flex min-h-screen flex-1 flex-col">
                    <WorkspaceTopBar
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
                            <DashboardMetricsGrid metrics={metrics} isLoading={isLoading} />
                            <DashboardChartsPanel data={stats?.chartData || []} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardPage
