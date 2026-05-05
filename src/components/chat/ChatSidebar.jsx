import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  ChartNoAxesCombined,
  ChevronDown,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
} from 'lucide-react'
import { ChatAPI, DocumentsAPI, ProjectsAPI } from '../../api/client'
import { useChat } from '../../context/useChat'
import ChatList from './ChatList'
import ContextModal from './ContextModal'
import ProjectSwitcher from './ProjectSwitcher'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Library', icon: BookOpen, to: '/library' },
  { label: 'Chat', icon: MessageSquare, to: '/chat' },
  { label: 'Summarize', icon: ChartNoAxesCombined },
  { label: 'Analytics', icon: BarChart3 },
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
    selectedDocumentIds,
    setSelectedDocumentIds,
    documentsRefreshToken,
  } = useChat()

  const [sessions, setSessions] = useState([])
  const [documents, setDocuments] = useState([])
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [projectSwitcherOpen, setProjectSwitcherOpen] = useState(false)
  const [contextModalOpen, setContextModalOpen] = useState(false)
  const [creatingSession, setCreatingSession] = useState(false)
  const [creatingProject, setCreatingProject] = useState(false)
  const [projectName, setProjectName] = useState('')

  useEffect(() => {
    if (!selectedProject?.id) return;

    let mounted = true

    const loadData = async () => {
      try {
        const [docsRes, sessionsRes] = await Promise.all([
          DocumentsAPI.list(selectedProject.id),
          ChatAPI.listSessions(selectedProject.id),
        ])

        if (!mounted) return

        const docs = docsRes.data.results || docsRes.data
        const sessionsData = sessionsRes.data.results || sessionsRes.data || []

        setDocuments(docs)
        setSessions(sessionsData)

        if (sessionsData.length > 0) {
          setCurrentSession(sessionsData[0])
          setSelectedDocumentIds(sessionsData[0].selected_document_ids || [])
        } else {
          setCurrentSession(null)
          setSelectedDocumentIds([])
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadData()

    return () => {
      mounted = false
    }
  }, [selectedProject?.id, documentsRefreshToken])

  useEffect(() => {
    if (!location.pathname.startsWith('/chat')) {
      setProjectSwitcherOpen(false)
    }
  }, [location.pathname])

  const selectedDocsCount = useMemo(() => selectedDocumentIds.length, [selectedDocumentIds])

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
      setSelectedDocumentIds(created.selected_document_ids || [])
    } catch (error) {
      console.error(error)
    } finally {
      setCreatingSession(false)
    }
  }

  const handleSessionSelect = (session) => {
    setCurrentSession(session)
    setSelectedDocumentIds(session.selected_document_ids || [])
  }

  const persistSelection = async (nextIds) => {
    setSelectedDocumentIds(nextIds)
    if (!currentSession) return
    try {
      const response = await ChatAPI.updateSession(currentSession.id, { selected_document_ids: nextIds })
      setCurrentSession(response.data)
      setSessions((list) => list.map((item) => (item.id === response.data.id ? response.data : item)))
    } catch (error) {
      console.error(error)
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

                  <button
                    type="button"
                    onClick={() => setContextModalOpen(true)}
                    className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-white/70"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-md bg-slate-500 text-slate-100">{selectedDocsCount}</span>
                    <span className="font-medium">Context Files</span>
                  </button>
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

      <ContextModal
        open={contextModalOpen}
        documents={documents}
        selectedDocumentIds={selectedDocumentIds}
        onToggle={(documentId) => {
          const nextIds = selectedDocumentIds.includes(documentId)
            ? selectedDocumentIds.filter((id) => id !== documentId)
            : [...selectedDocumentIds, documentId]
          persistSelection(nextIds)
        }}
        onClose={() => setContextModalOpen(false)}
        onClear={() => persistSelection([])}
      />
    </aside>
  )
}

export default ChatSidebar
