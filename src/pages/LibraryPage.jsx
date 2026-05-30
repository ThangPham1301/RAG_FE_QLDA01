import { useCallback, useEffect, useMemo, useState } from 'react'
import topbarAvatar from '../assets/library/topbar-avatar.png'
import { DocumentsAPI, TeamsAPI, UsersAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import LibraryDocumentPanel from '../components/layout/LibraryDocumentPanel'
import LibraryHeader from '../components/layout/LibraryHeader'
import LibraryStatsGrid from '../components/layout/LibraryStatsGrid'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import DocumentPreviewModal from '../components/layout/DocumentPreviewModal'

const normalizeDocument = (doc, sourceLabel) => ({
    ...doc,
    id: doc.id || doc.document_id,
    index_status: String(doc.index_status || 'pending').toLowerCase(),
    updated_at: doc.updated_at || doc.uploaded_at,
    source: sourceLabel || doc.source || doc.chat_session_title,
    extracted_text_preview: doc.extracted_text_preview || doc.extracted_text || '',
})

function LibraryPage() {
    const [libraryGroups, setLibraryGroups] = useState({
        myDocuments: [],
        sharedWithMe: [],
        teamDocuments: [],
    })
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [previewDoc, setPreviewDoc] = useState(null)
    const [shareDoc, setShareDoc] = useState(null)
    const [bulkShareIds, setBulkShareIds] = useState([])
    const [shareEmail, setShareEmail] = useState('')
    const [shareStatus, setShareStatus] = useState('')
    const [shareSuggestions, setShareSuggestions] = useState([])
    const [shareSuggestionsLoading, setShareSuggestionsLoading] = useState(false)

    const loadDocuments = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await TeamsAPI.sharedLibrary()
            const data = response.data || {}
            setLibraryGroups({
                myDocuments: (data.my_documents || []).map((doc) => normalizeDocument(doc, doc.chat_session_title || 'My Documents')),
                sharedWithMe: (data.shared_with_me || []).map((doc) => normalizeDocument(doc, 'Shared With Me')),
                teamDocuments: (data.team_documents || []).map((doc) => normalizeDocument(doc, 'Team Documents')),
            })
        } catch (err) {
            console.error('Error loading library documents:', err)
            setError(err?.response?.data?.detail || 'Khong the tai danh sach tai lieu.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadDocuments()
    }, [loadDocuments])

    useEffect(() => {
        window.addEventListener('realtime:library', loadDocuments)
        window.addEventListener('realtime:document', loadDocuments)
        return () => {
            window.removeEventListener('realtime:library', loadDocuments)
            window.removeEventListener('realtime:document', loadDocuments)
        }
    }, [loadDocuments])

    useEffect(() => {
        const query = shareEmail.trim()
        if (!(shareDoc || bulkShareIds.length > 0) || query.length < 2 || query.includes(',')) {
            setShareSuggestions([])
            return undefined
        }

        let active = true
        const timer = window.setTimeout(async () => {
            try {
                setShareSuggestionsLoading(true)
                const response = await UsersAPI.search(query)
                if (active) setShareSuggestions(response.data?.results || [])
            } catch (err) {
                console.error('User search failed:', err)
                if (active) setShareSuggestions([])
            } finally {
                if (active) setShareSuggestionsLoading(false)
            }
        }, 250)

        return () => {
            active = false
            window.clearTimeout(timer)
        }
    }, [shareEmail, shareDoc, bulkShareIds.length])

    const submitShare = async () => {
        if ((!shareDoc && bulkShareIds.length === 0) || !shareEmail.trim()) return
        try {
            setShareStatus('Sharing...')
            if (bulkShareIds.length > 0) {
                const response = await DocumentsAPI.bulkShare(bulkShareIds, shareEmail.trim())
                const sharedCount = response.data?.shared?.length || 0
                setShareStatus(`Shared ${sharedCount} document${sharedCount === 1 ? '' : 's'}.`)
            } else {
                await DocumentsAPI.share(shareDoc.id, shareEmail.trim())
                setShareStatus('Shared successfully.')
            }
            setShareEmail('')
            setShareSuggestions([])
            await loadDocuments()
            setTimeout(() => {
                setShareDoc(null)
                setBulkShareIds([])
                setShareStatus('')
            }, 700)
        } catch (err) {
            console.error(err)
            const data = err?.response?.data
            setShareStatus(data?.email?.[0] || data?.non_field_errors?.[0] || data?.detail || 'Cannot share this document.')
        }
    }

    const deleteDocument = async (doc) => {
        const confirmed = window.confirm(`Xoa tai lieu "${doc.title || 'Document'}"? Hanh dong nay khong the hoan tac.`)
        if (!confirmed) return
        try {
            await DocumentsAPI.delete(doc.id)
            await loadDocuments()
        } catch (err) {
            console.error(err)
            setError(err?.response?.data?.error || err?.response?.data?.detail || 'Cannot delete this document.')
        }
    }

    const bulkShareDocuments = (documentIds) => {
        if (!documentIds || documentIds.length === 0) return
        setBulkShareIds(documentIds)
        setShareDoc(null)
        setShareStatus('')
    }

    const bulkDeleteDocuments = async (documentIds, onDone) => {
        if (!documentIds || documentIds.length === 0) return
        const confirmed = window.confirm(`Xoa ${documentIds.length} tai lieu da chon? Hanh dong nay khong the hoan tac.`)
        if (!confirmed) return
        try {
            await DocumentsAPI.bulkDelete(documentIds)
            if (onDone) onDone()
            await loadDocuments()
        } catch (err) {
            console.error(err)
            setError(err?.response?.data?.error || err?.response?.data?.detail || 'Cannot delete selected documents.')
        }
    }

    const stats = useMemo(() => {
        const documents = [
            ...libraryGroups.myDocuments,
            ...libraryGroups.sharedWithMe,
            ...libraryGroups.teamDocuments,
        ]
        const totalDocuments = documents.length
        const indexedDocuments = documents.filter((doc) => ['indexed', 'ready'].includes(doc.index_status)).length
        const failedDocuments = documents.filter((doc) => ['failed', 'error'].includes(doc.index_status)).length
        return { totalDocuments, indexedDocuments, failedDocuments }
    }, [libraryGroups])

    return (
        <main className="min-h-screen bg-white">
            <div className="flex min-h-screen">
                <ArchiveSidebar activeItem="Library" ctaLabel="NEW RESEARCH" />

                <div className="flex min-h-screen flex-1 flex-col">
                    <WorkspaceTopBar
                        profileName="Dr. Sarah Chen"
                        profileRole="Senior Researcher"
                        avatarSrc={topbarAvatar}
                    />

                    <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl space-y-5">
                            <LibraryHeader />
                            <LibraryStatsGrid stats={stats} />
                            <LibraryDocumentPanel
                                title="My Documents"
                                description="Files owned by you from your chats and workspaces."
                                documents={libraryGroups.myDocuments}
                                isLoading={isLoading}
                                error={error}
                                onRefresh={loadDocuments}
                                onPreviewDocument={setPreviewDoc}
                                onShareDocument={setShareDoc}
                                onDeleteDocument={deleteDocument}
                                onBulkShare={bulkShareDocuments}
                                onBulkDelete={bulkDeleteDocuments}
                            />
                            <LibraryDocumentPanel
                                title="Shared With Me"
                                description="Files shared directly with you. You can view and download them, but ownership stays with the original uploader."
                                documents={libraryGroups.sharedWithMe}
                                isLoading={isLoading}
                                error=""
                                onRefresh={loadDocuments}
                                onPreviewDocument={setPreviewDoc}
                            />
                            <LibraryDocumentPanel
                                title="Team Documents"
                                description="Read-only team workspace files governed by team membership permissions."
                                documents={libraryGroups.teamDocuments}
                                isLoading={isLoading}
                                error=""
                                onRefresh={loadDocuments}
                                onPreviewDocument={setPreviewDoc}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {previewDoc && (
                <DocumentPreviewModal
                    document={previewDoc}
                    onClose={() => setPreviewDoc(null)}
                />
            )}
            {(shareDoc || bulkShareIds.length > 0) && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
                        <div className="border-b border-slate-200 px-5 py-4">
                            <h2 className="text-base font-bold text-slate-900">Share File</h2>
                            <p className="mt-1 truncate text-sm text-slate-500">{shareDoc ? shareDoc.title : `${bulkShareIds.length} selected documents`}</p>
                        </div>
                        <div className="space-y-3 p-5">
                            <input
                                value={shareEmail}
                                onChange={(event) => setShareEmail(event.target.value)}
                                placeholder="recipient@gmail.com"
                                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                            />
                            {(shareSuggestionsLoading || shareSuggestions.length > 0) && (
                                <div className="max-h-52 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                                    {shareSuggestionsLoading && <div className="px-3 py-2 text-xs text-slate-500">Searching...</div>}
                                    {shareSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.id}
                                            type="button"
                                            onClick={() => {
                                                setShareEmail(suggestion.email)
                                                setShareSuggestions([])
                                            }}
                                            className="flex w-full items-center justify-between gap-3 border-b border-slate-100 px-3 py-2 text-left text-sm last:border-b-0 hover:bg-slate-50"
                                        >
                                            <span className="min-w-0">
                                                <span className="block truncate font-semibold text-slate-800">{suggestion.full_name}</span>
                                                <span className="block truncate text-xs text-slate-500">{suggestion.email}</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {shareStatus && <p className="text-sm text-slate-600">{shareStatus}</p>}
                        </div>
                        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4">
                            <button type="button" onClick={() => { setShareDoc(null); setBulkShareIds([]); setShareEmail(''); setShareStatus(''); setShareSuggestions([]) }} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700">
                                Cancel
                            </button>
                            <button type="button" onClick={submitShare} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                                Share
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default LibraryPage
