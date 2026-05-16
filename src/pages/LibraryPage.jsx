import { useCallback, useEffect, useMemo, useState } from 'react'
import topbarAvatar from '../assets/library/topbar-avatar.png'
import { ChatAPI, DocumentsAPI, ProjectsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import LibraryDocumentPanel from '../components/layout/LibraryDocumentPanel'
import LibraryHeader from '../components/layout/LibraryHeader'
import LibraryStatsGrid from '../components/layout/LibraryStatsGrid'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import { useChat } from '../context/useChat'

const normalizeDocument = (document) => ({
    ...document,
    id: document.id || document.document_id,
    title: document.title || document.file_name || document.filename || document.name || 'Untitled document',
    file_type: document.file_type || document.type || 'file',
    project_name: document.project_name || document.project?.name || document.project || '',
    chat_session_title: document.chat_session_title || document.chat_session?.title || document.source_chat_title || '',
    source: document.source || document.upload_source || '',
    updated_at: document.updated_at || document.modified_at || document.created_at,
    index_status: String(document.index_status || document.status || 'pending').toLowerCase(),
    file_url: document.file_url || document.url || document.download_url || '',
})

const getDocumentList = (responseData) => {
    if (Array.isArray(responseData)) return responseData
    if (Array.isArray(responseData?.results)) return responseData.results
    if (Array.isArray(responseData?.documents)) return responseData.documents
    if (Array.isArray(responseData?.data)) return responseData.data
    return []
}

const getListData = (responseData) => {
    if (Array.isArray(responseData)) return responseData
    if (Array.isArray(responseData?.results)) return responseData.results
    return []
}

function LibraryPage() {
    const [documents, setDocuments] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const { projects, selectedProject, setSelectedChat } = useChat()

    const loadDocuments = useCallback(async () => {
        setIsLoading(true)
        setError('')
        try {
            const contextProjects = Array.isArray(projects) ? projects : []
            const projectPool = contextProjects.length > 0
                ? contextProjects
                : getListData((await ProjectsAPI.list()).data)

            const scopedProjects = selectedProject?.id
                ? projectPool.filter((project) => project.id === selectedProject.id)
                : projectPool
            const projectCandidates = scopedProjects.length > 0 ? scopedProjects : projectPool

            const sessionGroups = await Promise.all(
                projectCandidates.map(async (project) => {
                    try {
                        const sessionsResponse = await ChatAPI.listSessions(project.id)
                        return getListData(sessionsResponse.data).map((session) => ({ session, project }))
                    } catch (err) {
                        console.warn(`Failed to load sessions for project ${project.id}:`, err)
                        return []
                    }
                })
            )

            const sessionItems = sessionGroups.flat()
            if (sessionItems.length === 0) {
                setDocuments([])
                return
            }

            const details = await Promise.all(
                sessionItems.map(async ({ session, project }) => {
                    try {
                        const sessionDetail = (await ChatAPI.getSession(session.id)).data || {}
                        const baseProjectName = sessionDetail.project_name || sessionDetail.project?.name || project?.name || ''
                        const baseSessionTitle = sessionDetail.title || session.title || ''
                        const sessionDocs = getDocumentList(sessionDetail) || []
                        
                        return sessionDocs.map((document) => normalizeDocument({
                            ...document,
                            project_name: document.project_name || baseProjectName,
                            chat_session_title: document.chat_session_title || baseSessionTitle,
                        }))
                    } catch (err) {
                        console.warn(`Failed to load session ${session.id}:`, err)
                        return []
                    }
                })
            )

            const normalized = details.flat()
            const uniqueDocuments = Array.from(
                new Map(normalized.map((document) => [document.id, document])).values()
            )
            setDocuments(uniqueDocuments)
        } catch (err) {
            console.error('Error loading documents:', err)
            setError(err?.response?.data?.detail || 'Không thể tải danh sách tài liệu.')
        } finally {
            setIsLoading(false)
        }
    }, [projects, selectedProject?.id])

    const handleDeleteDocument = useCallback(async (document) => {
        const confirmed = window.confirm(`Xóa file "${document.title || 'Document'}"? Hành động này không thể hoàn tác.`)
        if (!confirmed) return

        try {
            await DocumentsAPI.delete(document.id)
            setDocuments((list) => list.filter((item) => item.id !== document.id))
            setSelectedChat((current) => {
                if (!current) return current
                return {
                    ...current,
                    documents: (current.documents || []).filter((item) => item.id !== document.id),
                }
            })
        } catch (err) {
            setError(err?.response?.data?.detail || 'Không thể xóa file.')
        }
    }, [setSelectedChat])

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
                                onDeleteDocument={handleDeleteDocument}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default LibraryPage
