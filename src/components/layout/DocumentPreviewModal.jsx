import { useEffect, useRef, useState } from 'react'
import { X, Download, FileText, RefreshCw, AlertCircle, BadgeCheck, Braces, RotateCw } from 'lucide-react'
import { DocumentsAPI } from '../../api/client'

const FILE_ICON = { pdf: 'PDF', docx: 'DOC', doc: 'DOC', txt: 'TXT', image: 'IMG', other: 'FILE' }

const STATUS = {
    indexed:  { label: 'Indexed',   cls: 'bg-emerald-100 text-emerald-700' },
    ready:    { label: 'Ready',     cls: 'bg-emerald-100 text-emerald-700' },
    indexing: { label: 'Indexing',  cls: 'bg-amber-100 text-amber-700'    },
    pending:  { label: 'Pending',   cls: 'bg-slate-100 text-slate-600'    },
    failed:   { label: 'Failed',    cls: 'bg-rose-100 text-rose-700'      },
    error:    { label: 'Error',     cls: 'bg-rose-100 text-rose-700'      },
}

const fmtDate = (v) => {
    if (!v) return '-'
    const d = new Date(v)
    return isNaN(d.getTime()) ? v : d.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

/** Split text into at most numPages logical "pages" by paragraphs */
const splitPages = (text = '', numPages = 2) => {
    const clean = text.trim()
    if (!clean) return []
    const parts = clean.split(/\n{2,}/).filter((p) => p.trim())
    if (parts.length <= numPages) return [clean] // too short, show as 1 page
    const half = Math.ceil(parts.length / numPages)
    return Array.from({ length: numPages }, (_, i) =>
        parts.slice(i * half, (i + 1) * half).join('\n\n').trim()
    ).filter(Boolean)
}

/* Text page card */
function PageCard({ text, page, total }) {
    return (
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Trang {page} / {total}
                </span>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4">
                <p className="whitespace-pre-wrap break-words font-['Georgia',serif] text-[13.5px] leading-7 text-slate-700">
                    {text}
                </p>
            </div>
            <div className="border-t border-slate-100 px-4 py-1.5 text-center text-[10px] text-slate-300">
                - {page} -
            </div>
        </div>
    )
}

/* Text viewer */
function TextViewer({ docId, fallbackText, fileType }) {
    const [text, setText]       = useState(fallbackText || '')
    const [status, setStatus]   = useState(fallbackText ? 'done' : 'loading')
    const [error, setError]     = useState('')

    useEffect(() => {
        if (fallbackText) { setText(fallbackText); setStatus('done'); return }
        setStatus('loading')
        DocumentsAPI.getText(docId)
            .then((res) => {
                const t = res.data?.extracted_text || ''
                setText(t)
                setStatus('done')
            })
            .catch((err) => {
                setError(err?.response?.data?.detail || err.message || 'Không thể tải nội dung.')
                setStatus('error')
            })
    }, [docId, fallbackText])

    if (status === 'loading') {
        return (
            <div className="flex h-full items-center justify-center gap-3 text-slate-500">
                <RefreshCw size={20} className="animate-spin text-indigo-500" />
                <span className="text-sm font-medium">Đang tải nội dung...</span>
            </div>
        )
    }

    if (status === 'error') {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-rose-200 bg-rose-50 p-8 text-center">
                <AlertCircle size={32} className="text-rose-400" />
                <p className="text-sm font-semibold text-rose-600">Không thể tải nội dung</p>
                <p className="text-xs text-rose-400">{error}</p>
            </div>
        )
    }

    const pages = splitPages(text, 2)

    if (!pages.length) {
        return (
            <div className="flex h-full flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <FileText size={36} className="text-slate-300" />
                <p className="text-sm font-semibold text-slate-500">Chưa có nội dung trích xuất</p>
                <p className="text-xs text-slate-400">
                    {fileType === 'pdf'
                        ? 'Nội dung PDF chưa được xử lý OCR.'
                        : 'Tài liệu đang indexing hoặc nội dung trống.'}
                </p>
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col gap-2">
            <div className="grid flex-1 gap-4 overflow-hidden md:grid-cols-2">
                {pages.map((p, i) => (
                    <PageCard key={i} text={p} page={i + 1} total={pages.length} />
                ))}
            </div>
            <p className="text-center text-[11px] text-slate-400">
                Xem trước 2 trang đầu - {text.length.toLocaleString()} ký tự đã trích xuất
            </p>
        </div>
    )
}

/* PDF viewer via iframe with JWT token in URL */
function PdfViewer({ docId }) {
    const src = DocumentsAPI.previewUrl(docId)
    return (
        <iframe
            src={src}
            title="PDF Preview"
            className="h-full w-full rounded-xl border border-slate-200 bg-slate-50"
            allow="fullscreen"
        />
    )
}

function FieldRow({ label, value }) {
    return (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
            <p className="mt-1 break-words text-sm font-semibold text-slate-800">{value || 'Chưa có dữ liệu'}</p>
        </div>
    )
}

function ExtractedFieldsPanel({ fields, isLoading, error, onRefreshFields, onReindex, isWorking }) {
    const signer = fields?.signer || {}
    const metadata = fields?.digital_signature_metadata || {}
    const documentNumber = fields?.document_number || {}
    const placeDate = fields?.place_date || {}
    const evidence = signer.evidence || []
    const hasSigner = signer.status === 'found' && signer.value

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center gap-3 text-slate-500">
                <RefreshCw size={20} className="animate-spin text-indigo-500" />
                <span className="text-sm font-medium">Đang tải thông tin trích xuất...</span>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900">Thông tin trích xuất</h3>
                    <p className="mt-1 text-xs text-slate-500">Các trường này được lấy từ OCR layout và validator, không để LLM tự đoán.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={onRefreshFields}
                        disabled={isWorking}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-400 disabled:opacity-50"
                    >
                        <RotateCw size={13} className={isWorking ? 'animate-spin' : ''} />
                        Re-extract fields
                    </button>
                    <button
                        type="button"
                        onClick={onReindex}
                        disabled={isWorking}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
                    >
                        <RefreshCw size={13} className={isWorking ? 'animate-spin' : ''} />
                        Reindex
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className={`rounded-xl border px-5 py-4 ${hasSigner ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
                <div className="flex items-start gap-3">
                    <BadgeCheck size={20} className={hasSigner ? 'text-emerald-600' : 'text-amber-600'} />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Người ký</p>
                        <p className="mt-1 text-lg font-extrabold text-slate-900">
                            {hasSigner ? signer.value : 'Không xác định được từ vùng chữ ký'}
                        </p>
                        <p className="mt-1 text-xs text-slate-600">
                            Confidence: {typeof signer.confidence === 'number' ? signer.confidence : 'N/A'} · Source: {signer.source || signer.status || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
                <FieldRow label="Số văn bản" value={documentNumber.value} />
                <FieldRow label="Ngày ban hành" value={placeDate.value} />
                <FieldRow label="Metadata người ký raw" value={metadata.nguoi_ky_raw} />
                <FieldRow label="Cơ quan ký số" value={metadata.co_quan} />
                <FieldRow label="Email ký số" value={metadata.email} />
                <FieldRow label="Thời gian ký" value={metadata.thoi_gian_ky} />
            </div>

            <div className="mt-4 rounded-xl border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-4 py-3">
                    <p className="text-sm font-bold text-slate-900">Bằng chứng vùng chữ ký</p>
                </div>
                <div className="space-y-2 p-4">
                    {evidence.length > 0 ? evidence.map((line, index) => (
                        <div key={`${line}-${index}`} className="rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">
                            {line}
                        </div>
                    )) : (
                        <p className="text-sm text-slate-500">Chưa có bằng chứng OCR đủ tin cậy.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

function OcrLayoutPanel({ layout, isLoading, error }) {
    const pages = layout?.pages || []
    const totalLines = pages.reduce((sum, page) => sum + (page.lines?.length || 0), 0)

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center gap-3 text-slate-500">
                <RefreshCw size={20} className="animate-spin text-indigo-500" />
                <span className="text-sm font-medium">Đang tải OCR layout...</span>
            </div>
        )
    }

    return (
        <div className="h-full overflow-y-auto">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-extrabold text-slate-900">OCR layout</h3>
                    <p className="mt-1 text-xs text-slate-500">{pages.length} trang · {totalLines} dòng OCR</p>
                </div>
                <Braces size={20} className="text-slate-400" />
            </div>
            {error && (
                <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}
            {pages.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
                    Chưa có OCR layout. Hãy reindex tài liệu sau khi bật OCR service.
                </div>
            ) : (
                <div className="space-y-4">
                    {pages.map((page) => (
                        <div key={page.page} className="rounded-xl border border-slate-200 bg-white">
                            <div className="border-b border-slate-100 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                                Trang {page.page} · {page.width}x{page.height}
                            </div>
                            <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto">
                                {(page.lines || []).map((line, index) => (
                                    <div key={`${page.page}-${index}`} className="grid gap-2 px-4 py-3 text-xs md:grid-cols-[1fr_170px_80px]">
                                        <p className="text-sm text-slate-800">{line.text}</p>
                                        <p className="font-mono text-slate-500">[{(line.bbox || []).join(', ')}]</p>
                                        <p className="text-slate-500">{typeof line.confidence === 'number' ? line.confidence.toFixed(2) : 'N/A'}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

/* Main modal */
export default function DocumentPreviewModal({ document: doc, onClose }) {
    const overlayRef = useRef(null)
    const isPdf  = doc.file_type === 'pdf'
    const hasUrl = Boolean(doc.file_url)
    const hasFallbackText = Boolean(doc.extracted_text_preview?.trim())

    const defaultTab = isPdf && hasUrl ? 'pdf' : 'text'
    const [activeTab, setActiveTab] = useState(defaultTab)
    const [fields, setFields] = useState(null)
    const [fieldsLoading, setFieldsLoading] = useState(true)
    const [fieldsError, setFieldsError] = useState('')
    const [ocrLayout, setOcrLayout] = useState(null)
    const [ocrLoading, setOcrLoading] = useState(true)
    const [ocrError, setOcrError] = useState('')
    const [actionLoading, setActionLoading] = useState(false)

    const statusInfo = STATUS[doc.index_status] || STATUS.pending

    const loadFields = async () => {
        setFieldsLoading(true)
        setFieldsError('')
        try {
            const response = await DocumentsAPI.getFields(doc.id)
            setFields(response.data?.extracted_fields || {})
        } catch (err) {
            setFieldsError(err?.response?.data?.detail || err.message || 'Không thể tải thông tin trích xuất.')
        } finally {
            setFieldsLoading(false)
        }
    }

    const loadOcrLayout = async () => {
        setOcrLoading(true)
        setOcrError('')
        try {
            const response = await DocumentsAPI.getOcrLayout(doc.id)
            setOcrLayout(response.data?.ocr_layout || {})
        } catch (err) {
            setOcrError(err?.response?.data?.detail || err.message || 'Không thể tải OCR layout.')
        } finally {
            setOcrLoading(false)
        }
    }

    const reextractFields = async () => {
        setActionLoading(true)
        setFieldsError('')
        try {
            const response = await DocumentsAPI.reextractFields(doc.id)
            setFields(response.data?.extracted_fields || {})
        } catch (err) {
            setFieldsError(err?.response?.data?.detail || err.message || 'Không thể chạy lại trích xuất field.')
        } finally {
            setActionLoading(false)
        }
    }

    const reindexDocument = async () => {
        setActionLoading(true)
        setFieldsError('')
        try {
            await DocumentsAPI.reindex(doc.id)
            await Promise.all([loadFields(), loadOcrLayout()])
        } catch (err) {
            setFieldsError(err?.response?.data?.detail || err.message || 'Không thể reindex tài liệu.')
        } finally {
            setActionLoading(false)
        }
    }

    useEffect(() => {
        const h = (e) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', h)
        return () => window.removeEventListener('keydown', h)
    }, [onClose])

    useEffect(() => {
        loadFields()
        loadOcrLayout()
    }, [doc.id])

    const onBackdrop = (e) => { if (e.target === overlayRef.current) onClose() }

    const tabs = [
        isPdf && hasUrl && { id: 'pdf',  label: 'Xem PDF' },
        { id: 'text', label: `${FILE_ICON[doc.file_type] || 'FILE'} Nội dung văn bản` },
        { id: 'fields', label: 'Thông tin trích xuất' },
        { id: 'ocr', label: 'OCR layout' },
    ].filter(Boolean)

    return (
        <div
            ref={overlayRef}
            onClick={onBackdrop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/65 p-4 backdrop-blur-sm"
            style={{ animation: 'dpFadeIn .15s ease' }}
        >
            <style>{`
                @keyframes dpFadeIn  { from { opacity: 0; } to { opacity: 1; } }
                @keyframes dpSlideUp { from { opacity: 0; transform: translateY(18px) scale(.97); } to { opacity: 1; transform: none; } }
            `}</style>

            <div
                className="flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                style={{ animation: 'dpSlideUp .2s ease' }}
            >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
                    <div className="flex min-w-0 items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-2xl">{FILE_ICON[doc.file_type] || 'FILE'}</span>
                        <div className="min-w-0">
                            <h2 className="truncate font-['Manrope'] text-lg font-extrabold text-slate-900" title={doc.title}>
                                {doc.title || 'Untitled Document'}
                            </h2>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span className="font-semibold text-indigo-600">{doc.project_name}</span>
                                {doc.chat_session_title && <><span>-</span><span>{doc.chat_session_title}</span></>}
                                <span>-</span>
                                <span>{fmtDate(doc.uploaded_at)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusInfo.cls}`}>
                            {statusInfo.label}
                        </span>
                        {hasUrl && (
                            <a
                                href={DocumentsAPI.previewUrl(doc.id)}
                                download={doc.title}
                                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                            >
                                <Download size={13} /> Tải về
                            </a>
                        )}
                        <button type="button" onClick={onClose}
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            aria-label="Đóng">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Meta strip */}
                <div className="flex flex-wrap gap-5 border-b border-slate-100 bg-slate-50/80 px-6 py-2 text-xs text-slate-500">
                    <span><span className="font-semibold text-slate-700">Loại: </span>{(doc.file_type || 'unknown').toUpperCase()}</span>
                    <span><span className="font-semibold text-slate-700">Chunks: </span>{doc.indexed_chunks ?? 0}</span>
                    <span><span className="font-semibold text-slate-700">Trạng thái: </span>{statusInfo.label}</span>
                </div>

                {/* Tabs */}
                {tabs.length > 1 && (
                    <div className="flex gap-1 border-b border-slate-200 bg-white px-6 pt-1">
                        {tabs.map((tab) => (
                            <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                                className={`rounded-t-lg px-4 py-2 text-sm font-semibold transition-colors ${
                                    activeTab === tab.id
                                        ? 'border-b-2 border-indigo-500 text-indigo-600'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Preview body */}
                <div className="min-h-0 flex-1 overflow-hidden p-5">
                    {activeTab === 'pdf' ? (
                        <PdfViewer docId={doc.id} />
                    ) : activeTab === 'fields' ? (
                        <ExtractedFieldsPanel
                            fields={fields}
                            isLoading={fieldsLoading}
                            error={fieldsError}
                            onRefreshFields={reextractFields}
                            onReindex={reindexDocument}
                            isWorking={actionLoading}
                        />
                    ) : activeTab === 'ocr' ? (
                        <OcrLayoutPanel
                            layout={ocrLayout}
                            isLoading={ocrLoading}
                            error={ocrError}
                        />
                    ) : (
                        <TextViewer
                            docId={doc.id}
                            fallbackText={hasFallbackText ? doc.extracted_text_preview : null}
                            fileType={doc.file_type}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}

