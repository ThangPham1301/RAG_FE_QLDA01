import { useCallback, useEffect, useMemo, useState } from 'react'
import topbarAvatar from '../assets/library/topbar-avatar.png'
import { StatisticsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import LibraryDocumentPanel from '../components/layout/LibraryDocumentPanel'
import LibraryHeader from '../components/layout/LibraryHeader'
import LibraryStatsGrid from '../components/layout/LibraryStatsGrid'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import DocumentPreviewModal from '../components/layout/DocumentPreviewModal'

/**
 * Flatten the library tree from StatisticsAPI.overview() → library.projects
 * Structure: projects[] → chat_sessions[] → documents[]
 */
const flattenLibraryTree = (projects = []) => {
    const docs = []
    for (const project of projects) {
        for (const chat of project.chat_sessions || []) {
            for (const doc of chat.documents || []) {
                docs.push({
                    id: doc.document_id,
                    title: doc.title,
                    file_type: doc.file_type,
                    index_status: String(doc.index_status || 'pending').toLowerCase(),
                    indexed_chunks: doc.indexed_chunks,
                    updated_at: doc.uploaded_at,
                    uploaded_at: doc.uploaded_at,
                    project_name: project.project_name,
                    project_id: project.project_id,
                    chat_session_id: chat.chat_session_id,
                    chat_session_title: chat.chat_session_title,
                    source: chat.chat_session_title,
                    file_url: doc.file_url || '',
                    extracted_text_preview: doc.extracted_text_preview || '',
                })
            }
        }
    }
    return docs
}

function LibraryPage() {
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [previewDoc, setPreviewDoc] = useState(null)

    const loadDocuments = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await StatisticsAPI.overview()
            const data = response.data || {}
            // library.projects is the nested tree built by BE
            const projectsTree = data?.library?.projects || []
            const docs = flattenLibraryTree(projectsTree)
            setDocuments(docs)
        } catch (err) {
            console.error('Error loading library documents:', err)
            setError(err?.response?.data?.detail || 'Không thể tải danh sách tài liệu.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadDocuments()
    }, [loadDocuments])

    const stats = useMemo(() => {
        const totalDocuments = documents.length
        const indexedDocuments = documents.filter((doc) => ['indexed', 'ready'].includes(doc.index_status)).length
        const failedDocuments = documents.filter((doc) => ['failed', 'error'].includes(doc.index_status)).length
        return { totalDocuments, indexedDocuments, failedDocuments }
    }, [documents])

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
                            <LibraryStatsGrid stats={stats} />
                            <LibraryDocumentPanel
                                documents={documents}
                                isLoading={isLoading}
                                error={error}
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
        </main>
    )
}

export default LibraryPage
