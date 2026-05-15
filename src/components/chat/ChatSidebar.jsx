import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  ChartNoAxesCombined,
  ChevronDown,
  FileText,
  Folder,
  FolderPlus,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Upload,
  Trash2,
  Users,
} from 'lucide-react'
import { ChatAPI, DocumentsAPI, ProjectsAPI } from '../../api/client'
import { useChat } from '../../context/useChat'
import CreateProjectModal from './CreateProjectModal'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Library', icon: BookOpen, to: '/library' },
  { label: 'Chat', icon: MessageSquare, to: '/chat' },
  { label: 'Summarize', icon: ChartNoAxesCombined },
  { label: 'Statistics', icon: BarChart3, to: '/statistics' },
  { label: 'Team', icon: Users },
  { label: 'Settings', icon: Settings, to: '/account' },
]

function ChatSidebar() {
  const {
    projects,
    selectedProject,
    setSelectedProject,
    setProjects,
    selectedChat,
    setSelectedChat,
  } = useChat()

  const [sessions, setSessions] = useState([])
  const [creatingProject, setCreatingProject] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ phase: 'idle', message: '' })
  const [documents, setDocuments] = useState([])
  const [expandedProjectId, setExpandedProjectId] = useState(null)
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!selectedProject?.id) {
      setSessions([])
      setSelectedChat(null)
      setDocuments([])
      setExpandedProjectId(null)
      return
    }

    let mounted = true
    setExpandedProjectId(selectedProject.id)
    setSelectedChat(null)
    setDocuments([])
    setSessions([])

    ChatAPI.listSessions(selectedProject.id)
      .then((response) => {
        if (!mounted) return
        const data = response.data.results || response.data || []
        setSessions(data)
      })
      .catch((error) => console.error(error))

    return () => {
      mounted = false
    }
  }, [selectedProject?.id, setSelectedChat])

  useEffect(() => {
    if (selectedChat?.id && selectedProject?.id) {
      setExpandedProjectId(selectedProject.id)
      setSessions((prev) => {
        const existingIndex = prev.findIndex((session) => session.id === selectedChat.id)
        if (existingIndex >= 0) {
          return prev.map((session) => (session.id === selectedChat.id ? selectedChat : session))
        }

        const temporaryIndex = selectedChat.isTemporary
          ? -1
          : prev.findIndex((session) => session.isTemporary && session.project_id === selectedProject.id)

        if (temporaryIndex >= 0) {
          return prev.map((session) => (
            session.isTemporary && session.project_id === selectedProject.id ? selectedChat : session
          ))
        }

        return [selectedChat, ...prev]
      })
    }
  }, [selectedChat?.id, selectedProject?.id, sessions])

  useEffect(() => {
    const sessionId = selectedChat?.id
    if (!sessionId) {
      setDocuments([])
      return
    }

    let mounted = true

    ChatAPI.getSession(sessionId)
      .then((response) => {
        if (!mounted) return
        const detail = response.data
        setSelectedChat(detail)
        setDocuments(detail.documents || [])
        setSessions((list) => list.map((item) => (item.id === detail.id ? detail : item)))
      })
      .catch((error) => console.error(error))

    return () => {
      mounted = false
    }
  }, [selectedChat?.id, setSelectedChat])

  const onCreateProject = async (name) => {
    try {
      setCreatingProject(true)
      const response = await ProjectsAPI.create(name)
      const created = response.data
      setProjects((list) => [created, ...list])
      setSelectedProject(created)
      setExpandedProjectId(created.id)
      setIsCreateProjectOpen(false)
    } catch (error) {
      console.error(error)
    } finally {
      setCreatingProject(false)
    }
  }

  const handleProjectSelect = (project) => {
    setExpandedProjectId(project.id)

    if (selectedProject?.id === project.id) {
      setSelectedChat(null)
      return
    }

    setSelectedProject(project)
    setSelectedChat(null)
  }

  const handleSessionSelect = (session, projectId) => {
    if (projectId) {
      setSelectedProject(projects.find((project) => project.id === projectId) || selectedProject)
      setExpandedProjectId(projectId)
    }
    setSelectedChat(session)
  }

  const handleToggleProjectExpand = (projectId) => {
    setExpandedProjectId((current) => (current === projectId ? null : projectId))
  }

  const handleDeleteProject = async (project, event) => {
    event.stopPropagation()

    const confirmed = window.confirm(`Xóa project "${project.name}"? Hành động này không thể hoàn tác.`)
    if (!confirmed) return

    try {
      await ProjectsAPI.delete(project.id)

      setProjects((list) => list.filter((item) => item.id !== project.id))

      if (selectedProject?.id === project.id) {
        const nextProject = projects.find((item) => item.id !== project.id) || null
        setSelectedProject(nextProject)
        setSelectedChat(null)
        setSessions([])
        setDocuments([])
        setExpandedProjectId(nextProject?.id || null)
      } else if (expandedProjectId === project.id) {
        setExpandedProjectId(null)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteSession = async (session, project, event) => {
    event.stopPropagation()

    const confirmed = window.confirm(`Xóa chat "${session.title || 'Chat'}"? Hành động này không thể hoàn tác.`)
    if (!confirmed) return

    try {
      await ChatAPI.delete(session.id)

      setSessions((list) => list.filter((item) => item.id !== session.id))
      setProjects((list) => list.map((item) => {
        if (item.id !== project.id) return item
        return {
          ...item,
          chats: (item.chats || []).filter((chat) => chat.id !== session.id),
        }
      }))

      if (selectedChat?.id === session.id) {
        setSelectedChat(null)
        setDocuments([])
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteDocument = async (document, event) => {
    event.stopPropagation()

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
    } catch (error) {
      console.error(error)
    }
  }

  const uploadFiles = async (files) => {
    if (!selectedChat?.id || !files || files.length === 0) return
    const formData = new FormData()
    for (const file of files) formData.append('files', file)
    let phaseTimer = null
    try {
      setUploading(true)
      setUploadStatus({ phase: 'uploading', message: 'Đang tải file lên...' })
      phaseTimer = setTimeout(() => {
        setUploadStatus({ phase: 'indexing', message: 'Đang index file để có thể hỏi đáp...' })
      }, 900)

      const response = await DocumentsAPI.upload(selectedChat.id, formData)
      if (phaseTimer) clearTimeout(phaseTimer)
      const uploadedDocs = response.data.documents || []
      setUploadStatus({ phase: 'success', message: `Đã tải lên ${uploadedDocs.length} file.` })

      const refreshed = await ChatAPI.getSession(selectedChat.id)
      const detail = refreshed.data
      setSelectedChat(detail)
      setDocuments(detail.documents || [])
      setSessions((list) => list.map((item) => (item.id === detail.id ? detail : item)))
    } catch (error) {
      console.error(error)
      if (phaseTimer) clearTimeout(phaseTimer)
      const errorMessage = error?.response?.data?.detail || error?.response?.data?.message || 'Upload failed'
      setUploadStatus({ phase: 'error', message: String(errorMessage) })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const navBeforeChat = NAV_ITEMS.slice(0, 2)
  const navAfterChat = NAV_ITEMS.slice(3)

  const renderProjectTree = () => {
    if (!projects || projects.length === 0) {
      return null
    }

    return projects.map((project) => {
      const isProjectSelected = selectedProject?.id === project.id
      const isProjectActive = isProjectSelected && !selectedChat
      const isExpanded = expandedProjectId === project.id
      const projectSessions = isProjectSelected ? sessions : []

      return (
        <div key={project.id} className="space-y-2">
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm transition ${isProjectActive ? 'bg-[#e5eeff] font-semibold text-blue-800' : 'text-slate-700 hover:bg-white/70'}`}>
            <button
              type="button"
              onClick={() => handleProjectSelect(project)}
              className="flex min-w-0 flex-1 items-center gap-3 text-left"
            >
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-md ${isProjectActive ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'}`}
                aria-hidden="true"
              >
                <Folder size={16} strokeWidth={2.2} />
              </span>
              <span className="min-w-0 flex-1 truncate font-medium">{project.name}</span>
            </button>

            <button
              type="button"
              onClick={(event) => handleDeleteProject(project, event)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              aria-label={`Xóa project ${project.name}`}
              title="Xóa project"
            >
              <Trash2 size={15} strokeWidth={2.2} />
            </button>

            <button
              type="button"
              onClick={() => handleToggleProjectExpand(project.id)}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-white/70 hover:text-slate-700"
              aria-label={isExpanded ? 'Thu gọn project' : 'Mở project'}
              title={isExpanded ? 'Thu gọn' : 'Mở rộng'}
            >
              <ChevronDown className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} size={16} strokeWidth={2.2} />
            </button>
          </div>

          {isExpanded && (
            <div className="space-y-2 pl-10">
              {projectSessions.length > 0 ? (
                projectSessions.map((session) => {
                  const isChatSelected = selectedChat?.id === session.id
                  const isChatActive = isChatSelected

                  return (
                    <div key={session.id} className="space-y-2">
                      <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ${isChatActive ? 'bg-[#e5eeff] font-semibold text-blue-800' : 'text-slate-700 hover:bg-white/70'}`}>
                        <button
                          type="button"
                          onClick={() => handleSessionSelect(session, project.id)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md ${isChatActive ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'}`}
                            aria-hidden="true"
                          >
                            {session?.title ? session.title.charAt(0).toUpperCase() : 'C'}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="truncate">{session?.title || 'Chat'}</div>
                            <div className="text-[10px] text-slate-500">
                              {session?.updated_at ? new Date(session.updated_at).toLocaleDateString() : ''}
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={(event) => handleDeleteSession(session, project, event)}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                          aria-label={`Xóa chat ${session?.title || 'Chat'}`}
                          title="Xóa chat"
                        >
                          <Trash2 size={14} strokeWidth={2.2} />
                        </button>
                      </div>

                      {isChatSelected && (
                        <div className="space-y-1 pl-4">
                          {documents.length > 0 ? (
                            documents.map((document) => (
                              <div key={document.id} className="flex items-start gap-2 rounded-lg px-3 py-2 text-sm text-slate-700">
                                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-slate-500 text-slate-100" aria-hidden="true">
                                  <FileText size={15} strokeWidth={2.2} />
                                </span>
                                <div className="min-w-0 flex-1">
                                  <div className="truncate font-medium">{document.title}</div>
                                  <div className="text-[10px] text-slate-500">{document.index_status || 'pending'}</div>
                                </div>
                                <button
                                  type="button"
                                  onClick={(event) => handleDeleteDocument(document, event)}
                                  className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                                  aria-label={`Xóa file ${document.title || 'Document'}`}
                                  title="Xóa file"
                                >
                                  <Trash2 size={14} strokeWidth={2.2} />
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-slate-600">No files in this chat</div>
                          )}

                          <div className="px-3 pb-1">
                            <input
                              ref={fileInputRef}
                              type="file"
                              multiple
                              hidden
                              onChange={(event) => uploadFiles(event.target.files)}
                            />
                            <button
                              type="button"
                              onClick={() => fileInputRef.current && fileInputRef.current.click()}
                              disabled={!selectedChat || uploading}
                              className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <Upload size={14} />
                              <span className="font-medium">Upload file</span>
                            </button>
                            {(uploading || uploadStatus.phase === 'success' || uploadStatus.phase === 'error') && (
                              <div className={`mt-2 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${uploadStatus.phase === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : uploadStatus.phase === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                                <span>{uploadStatus.message}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="px-3 py-2 text-sm text-slate-600">No chats yet</div>
              )}
            </div>
          )}
        </div>
      )
    })
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-800/70 bg-slate-950/95 py-6 text-slate-100 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
      <div className="mx-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_12px_30px_rgba(2,6,23,0.18)]">
        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
          <span className="font-['Manrope'] text-sm font-extrabold">S</span>
        </div>
        <div>
          <p className="font-['Manrope'] text-lg font-bold text-white">Cognitive Slate</p>
          <p className="text-[10px] font-semibold tracking-[0.28em] text-slate-400">INTELLIGENT ARCHIVE</p>
        </div>
      </div>

      <div className="mt-5 flex flex-1 flex-col px-3">
        <div className="space-y-1">
          {navBeforeChat.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              end={to === '/dashboard'}
              className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${isActive
                  ? 'bg-white/10 font-semibold text-white ring-1 ring-white/10 shadow-[0_10px_24px_rgba(15,23,42,0.18)]'
                  : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
              title={label}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-xl ${isActive ? 'bg-linear-to-br from-cyan-400 to-blue-600 text-white' : 'bg-white/10 text-slate-300'}`}
                    aria-hidden="true"
                  >
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  <span className={`flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 px-1 py-1 text-sm text-slate-200 shadow-[0_12px_30px_rgba(2,6,23,0.12)]">
            <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-400">
              Projects
            </div>

            <div className="px-3">
              <button
                type="button"
                onClick={() => setIsCreateProjectOpen(true)}
                className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-slate-100 transition hover:bg-white/8"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-white/10 text-slate-100 ring-1 ring-white/10" aria-hidden="true">
                  <FolderPlus size={16} strokeWidth={2.2} />
                </span>
                <span className="font-medium">New project</span>
              </button>
            </div>

            {projects && projects.length > 0 ? (
              <div className="space-y-3 pt-1">
                {renderProjectTree()}
              </div>
            ) : null}
          </div>

          {navAfterChat.map(({ label, icon: Icon, to }) => {
            if (!to) {
              return (
                <button
                  key={label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
                  title={label}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/10 text-slate-300" aria-hidden="true">
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  <span className="font-medium">{label}</span>
                </button>
              )
            }

            return (
              <NavLink
                key={label}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${isActive
                    ? 'bg-white/10 font-semibold text-white ring-1 ring-white/10 shadow-[0_10px_24px_rgba(15,23,42,0.18)]'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`
                }
                title={label}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-xl ${isActive ? 'bg-linear-to-br from-cyan-400 to-blue-600 text-white' : 'bg-white/10 text-slate-300'}`}
                      aria-hidden="true"
                    >
                      <Icon size={16} strokeWidth={2.2} />
                    </span>
                    <span className={`flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </div>

      <CreateProjectModal
        open={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        onCreate={onCreateProject}
        loading={creatingProject}
      />
    </aside>
  )
}

export default ChatSidebar
