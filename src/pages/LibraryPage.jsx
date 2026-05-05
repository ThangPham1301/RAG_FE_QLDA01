import { useCallback, useEffect, useMemo, useState } from 'react'
import topbarAvatar from '../assets/library/topbar-avatar.png'
import { DocumentsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import LibraryDocumentPanel from '../components/layout/LibraryDocumentPanel'
import LibraryHeader from '../components/layout/LibraryHeader'
import LibraryStatsGrid from '../components/layout/LibraryStatsGrid'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'

function LibraryPage() {
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')

    const loadDocuments = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            const response = await DocumentsAPI.list()
            const list = response.data.results || response.data || []
            setDocuments(list.filter((doc) => Boolean(doc.uploaded_chat_session)))
        } catch (err) {
            setError('Không thể tải danh sách tài liệu.')
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadDocuments()
    }, [loadDocuments])

    const stats = useMemo(() => {
        const totalDocuments = documents.length
        const indexedDocuments = documents.filter((doc) => doc.index_status === 'indexed').length
        const failedDocuments = documents.filter((doc) => doc.index_status === 'failed').length
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
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LibraryPage
