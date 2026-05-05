import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  ChartNoAxesCombined,
  ChevronDown,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Upload,
  Users,
} from 'lucide-react'
import { ChatAPI, DocumentsAPI, ProjectsAPI } from '../../api/client'
import { useChat } from '../../context/useChat'
import ChatList from './ChatList'
import ProjectSwitcher from './ProjectSwitcher'

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
  const location = useLocation()
  const {
    projects,
    selectedProject,
    setSelectedProject,
    setProjects,
    currentSession,
    setCurrentSession,
  } = useChat()

  const [sessions, setSessions] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false)
  const [creatingSession, setCreatingSession] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState({ phase: 'idle', message: '' })
  const [documents, setDocuments] = useState([])
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!selectedProject?.id) {
      setSessions([])
      setCurrentSession(null)
      setDocuments([])
      return
    }

    let mounted = true

    ChatAPI.listSessions(selectedProject.id)
      .then((response) => {
        if (!mounted) return
        const data = response.data.results || response.data || []
        setSessions(data)

        const currentSessionId = currentSession?.id
        const nextSession = currentSessionId
          ? data.find((item) => item.id === currentSessionId) || data[0] || null
          : data[0] || null

        if (nextSession) {
          setCurrentSession(nextSession)
        } else {
          setCurrentSession(null)
          setDocuments([])
        }
      })
      .catch((error) => console.error(error))

    return () => {
      mounted = false
    }
  }, [selectedProject?.id, currentSession?.id, setCurrentSession])

  useEffect(() => {
    const sessionId = currentSession?.id
    if (!sessionId) {
      setDocuments([])
      return
    }

    let mounted = true

    ChatAPI.getSession(sessionId)
      .then((response) => {
        if (!mounted) return
        const detail = response.data
        setCurrentSession(detail)
        setDocuments(detail.documents || [])
        setSessions((list) => list.map((item) => (item.id === detail.id ? detail : item)))
      })
      .catch((error) => console.error(error))

    return () => {
      mounted = false
    }
  }, [currentSession?.id, setCurrentSession])

  useEffect(() => {
    if (!location.pathname.startsWith('/chat')) {
      setProjectSwitcherOpen(false)
    }
  }, [location.pathname])

  const selectedDocsCount = useMemo(() => documents.length, [documents])

  const onCreateProject = async () => {
    if (!projectName) return
    try {
      const response = await ProjectsAPI.create(projectName)
      const created = response.data
      setProjects((list) => [created, ...list])
      setSelectedProject(created)
      setProjectName('')
      setProjectSwitcherOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  const createNewChat = async () => {
    if (!selectedProject || creatingSession) return
    setCreatingSession(true)
    try {
      const response = await ChatAPI.createSession(selectedProject.id)
      const created = response.data
      setSessions((list) => [created, ...list])
      setCurrentSession(created)
    } catch (error) {
      console.error(error)
    } finally {
      setCreatingSession(false)
    }
  }

  const handleSessionSelect = (session) => {
    setCurrentSession(session)
  }

  const uploadFiles = async (files) => {
    if (!currentSession?.id || !files || files.length === 0) return
    const formData = new FormData()
    for (const file of files) formData.append('files', file)
    let phaseTimer = null
    try {
      setUploading(true)
      setUploadStatus({ phase: 'uploading', message: 'Đang tải file lên...' })
      phaseTimer = setTimeout(() => {
        setUploadStatus({ phase: 'indexing', message: 'Đang index file để có thể hỏi đáp...' })
      }, 900)

      const response = await DocumentsAPI.upload(currentSession.id, formData)
      if (phaseTimer) clearTimeout(phaseTimer)
      const uploadedDocs = response.data.documents || []
      setUploadStatus({ phase: 'success', message: `Đã tải lên ${uploadedDocs.length} file.` })

      const refreshed = await ChatAPI.getSession(currentSession.id)
      const detail = refreshed.data
      setCurrentSession(detail)
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

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-auto border-r border-slate-200 bg-[#eff4ff] py-6">
      <div className="flex items-center gap-3 px-6">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-950 text-white">
          <span className="font-['Manrope'] text-sm font-extrabold">S</span>
        </div>
        <div>
          <p className="font-['Manrope'] text-lg font-bold text-slate-900">Cognitive Slate</p>
          <p className="text-[10px] font-semibold tracking-wide text-slate-600">INTELLIGENT ARCHIVE</p>
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
                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${isActive
                  ? 'bg-[#e5eeff] font-semibold text-blue-800'
                  : 'text-slate-700 hover:bg-white/70'
                } ${label === 'Dashboard' ? 'border-2 border-slate-900' : 'border-2 border-transparent'}`
              }
              title={label}
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-md ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'}`}
                    aria-hidden="true"
                  >
                    <Icon size={16} strokeWidth={2.2} />
                  </span>
                  <span className={`flex-1 ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <div className="rounded-xl border-2 border-transparent text-sm text-slate-700 transition">
            <button
              type="button"
              onClick={() => setIsChatOpen((open) => !open)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition ${location.pathname.startsWith('/chat') ? 'bg-[#e5eeff] font-semibold text-blue-800' : 'text-slate-700 hover:bg-white/70'}`}
              aria-expanded={isChatOpen}
              aria-controls="chat-accordion"
            >
              <span
                className={`grid h-8 w-8 place-items-center rounded-md ${location.pathname.startsWith('/chat') ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'}`}
                aria-hidden="true"
              >
                <MessageSquare size={16} strokeWidth={2.2} />
              </span>
              <span className={`flex-1 font-medium ${location.pathname.startsWith('/chat') ? 'font-semibold' : ''}`}>Chat</span>
              <ChevronDown className={`shrink-0 transition-transform duration-200 ${isChatOpen ? 'rotate-180' : 'rotate-0'}`} size={16} strokeWidth={2.2} />
            </button>

            <div
              id="chat-accordion"
              className={`grid overflow-hidden transition-all duration-200 ${isChatOpen ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'}`}
            >
              <div className="min-h-0 overflow-hidden pl-2 pr-1">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={createNewChat}
                    disabled={!selectedProject || creatingSession}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm font-semibold text-slate-700 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-500 text-slate-100">+</span>
                    <span className="font-medium">New Chat</span>
                  </button>

                  {!selectedProject && (
                    <div className="px-2 text-xs font-semibold text-rose-600">Create a project first</div>
                  )}

                  <ProjectSwitcher
                    projects={projects}
                    selectedProject={selectedProject}
                    open={projectSwitcherOpen}
                    onToggle={() => setProjectSwitcherOpen((open) => !open)}
                    onSelect={(project) => {
                      setSelectedProject(project)
                      setProjectSwitcherOpen(false)
                    }}
                    creating={creatingProject}
                    name={projectName}
                    setName={setProjectName}
                    onCreate={onCreateProject}
                  />

                  <ChatList sessions={sessions} activeSessionId={currentSession?.id} onSelect={handleSessionSelect} />

                  <div className="space-y-2">
                    <div className="px-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Files</div>
                    <div className="space-y-1">
                      {documents.length > 0 ? (
                        documents.map((document) => (
                          <div key={document.id} className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-sm text-slate-700 transition hover:bg-white/70">
                            <div className="min-w-0 flex-1">
                              <div className="truncate font-medium">{document.title}</div>
                              <div className="text-[10px] text-slate-500">{document.index_status || 'pending'}</div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="px-2 py-2 text-sm text-slate-600">No files in this chat</div>
                      )}
                    </div>

                    <div className="px-2">
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
                        disabled={!currentSession || uploading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Upload size={14} />
                        <span className="font-medium">Upload file</span>
                      </button>
                      {(uploading || uploadStatus.phase === 'success' || uploadStatus.phase === 'error') && (
                        <div className={`mt-2 flex items-center gap-2 rounded-lg border px-2 py-2 text-xs ${uploadStatus.phase === 'error' ? 'border-rose-200 bg-rose-50 text-rose-700' : uploadStatus.phase === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-white text-slate-600'}`}>
                          <span>{uploadStatus.message}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {navAfterChat.map(({ label, icon: Icon, to }) => {
            if (!to) {
              return (
                <button
                  key={label}
                  type="button"
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition text-slate-700 hover:bg-white/70 ${label === 'Dashboard' ? 'border-2 border-slate-900' : 'border-2 border-transparent'}`}
                  title={label}
                >
                  <span className="grid h-8 w-8 place-items-center rounded-md bg-slate-500 text-slate-100" aria-hidden="true">
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
                  `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${isActive
                    ? 'bg-[#e5eeff] font-semibold text-blue-800'
                    : 'text-slate-700 hover:bg-white/70'
                  } ${label === 'Dashboard' ? 'border-2 border-slate-900' : 'border-2 border-transparent'}`
                }
                title={label}
              >
                {({ isActive }) => (
                  <>
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-md ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'}`}
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
    </aside>
  )
}

export default ChatSidebar
