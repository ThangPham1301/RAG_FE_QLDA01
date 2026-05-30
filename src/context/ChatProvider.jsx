import { useCallback, useEffect, useState } from 'react'
import { ProjectsAPI } from '../api/client'
import { ChatContext } from './chatContext'

export function ChatProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [selectedChat, setSelectedChat] = useState(null)
  const [projectsLoading, setProjectsLoading] = useState(false)
  const [projectsError, setProjectsError] = useState('')

  const loadProjects = useCallback(async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      const response = await ProjectsAPI.list()
      const list = response.data.results || response.data || []
      setProjects(list)
      setSelectedProject((previous) => {
        if (previous && list.some((project) => project.id === previous.id)) return previous
        return list.length > 0 ? list[0] : null
      })
    } catch (error) {
      console.error('[ChatProvider] load projects failed:', error)
      setProjects([])
      setSelectedProject(null)
      setSelectedChat(null)
      const status = error?.response?.status
      setProjectsError(
        status === 401
          ? 'Session expired. Please sign in again to load your projects.'
          : (error?.response?.data?.detail || error?.response?.data?.error || 'Cannot load projects.')
      )
    } finally {
      setProjectsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProjects()
  }, [loadProjects])

  return (
    <ChatContext.Provider value={{
      projects,
      selectedProject,
      setSelectedProject,
      setProjects,
      projectsLoading,
      projectsError,
      loadProjects,
      selectedChat,
      setSelectedChat,
    }}>
      {children}
    </ChatContext.Provider>
  )
}
