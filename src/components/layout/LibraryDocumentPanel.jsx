import { Eye, ExternalLink, RefreshCw, Search, Share2, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import DocumentTableRow from '../ui/DocumentTableRow'

const formatDate = (value) => {
    if (!value) return '—'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return value
    return date.toLocaleDateString('vi-VN')
}

const toFileInfo = (document) => {
    const type = (document.file_type || 'file').toUpperCase()
    return `${type} • ${document.project_name || 'No project'}`
}

const normalizeStatus = (indexStatus) => {
    const status = String(indexStatus || '').toLowerCase()
    if (status === 'indexed' || status === 'ready') return 'INDEXED'
    if (status === 'failed' || status === 'error') return 'FAILED'
    if (status === 'indexing' || status === 'processing' || status === 'queued' || status === 'pending') return 'PROCESSING'
    return 'SYNCED'
}

function LibraryDocumentPanel({
    title = 'Document Library',
    description = 'Tài liệu được upload từ màn hình Chat, phân tách theo project và chat session.',
    documents = [],
    isLoading = false,
    error = '',
    onRefresh = null,
    onDeleteDocument = null,
    onPreviewDocument = null,
    onShareDocument = null,
}) {
    const [searchValue, setSearchValue] = useState('')
    const [projectFilter, setProjectFilter] = useState('all')

    const projectOptions = useMemo(() => {
        const names = Array.from(new Set(documents.map((doc) => doc.project_name).filter(Boolean)))
        return names.sort((a, b) => a.localeCompare(b))
    }, [documents])

    const filteredDocuments = useMemo(() => {
        return documents.filter((document) => {
            const matchesProject = projectFilter === 'all' || document.project_name === projectFilter
            const sourceText = document.chat_session_title || ''
            const query = searchValue.trim().toLowerCase()
            const matchesSearch = !query
                || document.title?.toLowerCase().includes(query)
                || document.project_name?.toLowerCase().includes(query)
                || sourceText.toLowerCase().includes(query)
            return matchesProject && matchesSearch
        })
    }, [documents, projectFilter, searchValue])

    return (
        <section className="space-y-5">
            <article className="rounded-2xl bg-white shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                <div className="border-b border-slate-200 px-6 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">{title}</h2>
                            <p className="mt-1 text-sm text-slate-600">{description}</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => onRefresh && onRefresh()}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                        >
                            <RefreshCw size={15} />
                            Refresh
                        </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                        <div className="relative">
                            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchValue}
                                onChange={(event) => setSearchValue(event.target.value)}
                                placeholder="Tìm theo tên tài liệu, project hoặc chat..."
                                className="w-72 rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none focus:border-blue-400"
                            />
                        </div>
                        <select
                            value={projectFilter}
                            onChange={(event) => setProjectFilter(event.target.value)}
                            className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
                        >
                            <option value="all">All projects</option>
                            {projectOptions.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                    </div>

                    {error && (
                        <p className="mt-3 text-sm text-rose-600">{error}</p>
                    )}
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">DOCUMENT</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">PROJECT</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">SOURCE</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">NGÀY UPLOAD</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">STATUS</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center">
                                        <div className="inline-flex items-center gap-2 text-sm text-slate-500">
                                            <RefreshCw size={15} className="animate-spin" />
                                            Đang tải tài liệu...
                                        </div>
                                    </td>
                                </tr>
                            )}
                            {!isLoading && filteredDocuments.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-500">
                                        Chưa có tài liệu nào trong thư viện.
                                    </td>
                                </tr>
                            )}
                            {!isLoading && filteredDocuments.map((doc) => (
                                <DocumentTableRow
                                    key={doc.id}
                                    icon={<Eye size={16} />}
                                    title={doc.title}
                                    fileInfo={toFileInfo(doc)}
                                    category={doc.project_name || '—'}
                                    source={doc.chat_session_title || doc.source || 'System'}
                                    modified={formatDate(doc.updated_at)}
                                    status={normalizeStatus(doc.index_status)}
                                    actions={(
                                        <div className="flex items-center gap-1">
                                            {/* Preview button */}
                                            {onPreviewDocument && (
                                                <button
                                                    type="button"
                                                    onClick={() => onPreviewDocument(doc)}
                                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100"
                                                    title="Xem trước tài liệu"
                                                >
                                                    <Eye size={13} />
                                                    Preview
                                                </button>
                                            )}
                                            {/* Open in new tab */}
                                            {doc.file_url && (
                                                <a
                                                    href={doc.file_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="rounded p-2 hover:bg-slate-100"
                                                    title="Mở trong tab mới"
                                                >
                                                    <ExternalLink size={14} className="text-slate-500" />
                                                </a>
                                            )}
                                            {onShareDocument && doc.can_share && (
                                                <button
                                                    type="button"
                                                    onClick={() => onShareDocument(doc)}
                                                    className="rounded p-2 hover:bg-blue-50"
                                                    title="Share with user"
                                                >
                                                    <Share2 size={14} className="text-blue-600" />
                                                </button>
                                            )}
                                            {/* Delete button */}
                                            {onDeleteDocument && (
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteDocument(doc)}
                                                    className="rounded p-2 hover:bg-rose-50"
                                                    title="Xóa tài liệu"
                                                >
                                                    <Trash2 size={14} className="text-rose-500" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-slate-200 px-6 py-3">
                    <p className="text-xs text-slate-600">
                        Hiển thị <span className="font-semibold text-slate-800">{filteredDocuments.length}</span> tài liệu
                        {documents.length !== filteredDocuments.length && (
                            <span className="text-slate-400"> (trên tổng {documents.length})</span>
                        )}
                    </p>
                </div>
            </article>
        </section>
    )
}

export default LibraryDocumentPanel
