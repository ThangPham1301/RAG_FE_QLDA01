import { Activity, Database, Files, FolderSync, Pin, ShieldAlert, Star, TrendingUp, UploadCloud, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import avatarProfile from '../assets/dashboard/avatar-profile.png'
import { EvaluationsAPI, StatisticsAPI } from '../api/client'
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
    const [evaluationStats, setEvaluationStats] = useState(null)
    const [evaluations, setEvaluations] = useState([])
    const [evaluationFilter, setEvaluationFilter] = useState({ rating: '', pinned: '' })

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

    useEffect(() => {
        let mounted = true
        const params = {
            ...(evaluationFilter.rating ? { rating: evaluationFilter.rating } : {}),
            ...(evaluationFilter.pinned ? { pinned: evaluationFilter.pinned } : {}),
        }
        Promise.all([
            EvaluationsAPI.stats(),
            EvaluationsAPI.list(params),
        ])
            .then(([statsResponse, listResponse]) => {
                if (!mounted) return
                setEvaluationStats(statsResponse.data)
                const data = listResponse.data?.results || listResponse.data || []
                setEvaluations(data.slice(0, 8))
            })
            .catch((err) => {
                console.error('Error loading evaluations:', err)
            })
        return () => {
            mounted = false
        }
    }, [evaluationFilter])

    const refreshEvaluations = async () => {
        const params = {
            ...(evaluationFilter.rating ? { rating: evaluationFilter.rating } : {}),
            ...(evaluationFilter.pinned ? { pinned: evaluationFilter.pinned } : {}),
        }
        const [statsResponse, listResponse] = await Promise.all([
            EvaluationsAPI.stats(),
            EvaluationsAPI.list(params),
        ])
        setEvaluationStats(statsResponse.data)
        const data = listResponse.data?.results || listResponse.data || []
        setEvaluations(data.slice(0, 8))
    }

    useEffect(() => {
        const refresh = () => {
            refreshEvaluations()
            StatisticsAPI.overview()
                .then((response) => setStats(normalizeOverview(response.data)))
                .catch((err) => console.error('Realtime dashboard refresh failed:', err))
        }
        window.addEventListener('realtime:evaluation', refresh)
        window.addEventListener('realtime:document', refresh)
        return () => {
            window.removeEventListener('realtime:evaluation', refresh)
            window.removeEventListener('realtime:document', refresh)
        }
    }, [evaluationFilter])

    const togglePinEvaluation = async (evaluation) => {
        try {
            if (evaluation.is_pinned) {
                await EvaluationsAPI.unpin(evaluation.id)
            } else {
                await EvaluationsAPI.pin(evaluation.id)
            }
            await refreshEvaluations()
        } catch (err) {
            console.error('Error pinning evaluation:', err)
        }
    }

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
                            <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                                <div className="flex flex-wrap items-start justify-between gap-4">
                                    <div>
                                        <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Conversation Evaluations</h2>
                                        <p className="mt-1 text-sm text-slate-600">Latest official evaluations from user chat sessions.</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <select
                                            value={evaluationFilter.rating}
                                            onChange={(event) => setEvaluationFilter((current) => ({ ...current, rating: event.target.value }))}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                                        >
                                            <option value="">All ratings</option>
                                            {[5, 4, 3, 2, 1].map((value) => (
                                                <option key={value} value={value}>{value} stars</option>
                                            ))}
                                        </select>
                                        <select
                                            value={evaluationFilter.pinned}
                                            onChange={(event) => setEvaluationFilter((current) => ({ ...current, pinned: event.target.value }))}
                                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                                        >
                                            <option value="">All</option>
                                            <option value="true">Pinned</option>
                                            <option value="false">Unpinned</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-xl bg-slate-50 px-4 py-3">
                                            <div className="text-xs font-semibold uppercase text-slate-400">Total</div>
                                            <div className="mt-1 text-2xl font-extrabold text-slate-900">{evaluationStats?.total ?? 0}</div>
                                        </div>
                                        <div className="rounded-xl bg-amber-50 px-4 py-3">
                                            <div className="text-xs font-semibold uppercase text-amber-600">Average</div>
                                            <div className="mt-1 text-2xl font-extrabold text-amber-700">{evaluationStats?.average_rating ?? 0}</div>
                                        </div>
                                        <div className="rounded-xl bg-blue-50 px-4 py-3">
                                            <div className="text-xs font-semibold uppercase text-blue-600">Pinned</div>
                                            <div className="mt-1 text-2xl font-extrabold text-blue-800">{evaluationStats?.pinned ?? 0}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
                                    <div className="grid grid-cols-[1.2fr_1fr_110px_100px] gap-3 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                                        <span>Conversation</span>
                                        <span>User</span>
                                        <span>Rating</span>
                                        <span>Pin</span>
                                    </div>
                                    {evaluations.length === 0 ? (
                                        <div className="px-4 py-6 text-sm text-slate-500">No evaluations yet.</div>
                                    ) : evaluations.map((item) => (
                                        <div key={item.id} className="grid grid-cols-[1.2fr_1fr_110px_100px] gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-700">
                                            <div className="min-w-0">
                                                <div className="truncate font-semibold text-slate-900">{item.chat_title || `Session #${item.chat_session}`}</div>
                                                <div className="truncate text-xs text-slate-500">{item.project_name || 'No project'}{item.comment ? ` - ${item.comment}` : ''}</div>
                                            </div>
                                            <div className="truncate">{item.user_email}</div>
                                            <div className="flex items-center gap-1 font-semibold text-amber-600">
                                                <Star size={14} fill="currentColor" />
                                                {item.rating}/5
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => togglePinEvaluation(item)}
                                                className={`inline-flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${item.is_pinned ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                            >
                                                <Pin size={13} fill={item.is_pinned ? 'currentColor' : 'none'} />
                                                {item.is_pinned ? 'Pinned' : 'Pin'}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            <DashboardChartsPanel data={stats?.chartData || []} isLoading={isLoading} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default DashboardPage
