import { useEffect, useState } from 'react'
import { ProjectsAPI } from '../api/client'
import { ChatContext } from './chatContext'

export function ChatProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [currentSession, setCurrentSession] = useState(null)
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([])
  const [documentsRefreshToken, setDocumentsRefreshToken] = useState(0)

  useEffect(() => {
    let mounted = true
    ProjectsAPI.list()
      .then((response) => {
        if (!mounted) return
        const list = response.data.results || response.data
        setProjects(list)
        setSelectedProject((previous) => previous || (list.length > 0 ? list[0] : null))
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  return (
    <ChatContext.Provider value={{
      projects,
      selectedProject,
      setSelectedProject,
      setProjects,
      currentSession,
      setCurrentSession,
      selectedDocumentIds,
      setSelectedDocumentIds,
      documentsRefreshToken,
      setDocumentsRefreshToken,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
