import { useState } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'
import { ChatContext } from '../../src/context/chatContext'

export const defaultProject = { id: 1, name: 'Test Project' }

export function buildInitialChatState(overrides = {}) {
  return {
    projects: [defaultProject],
    selectedProject: defaultProject,
    currentSession: { id: 10, project: 1, title: 'Session 10', selected_document_ids: [] },
    selectedDocumentIds: [],
    documentsRefreshToken: 0,
    ...overrides,
  }
}

function StatefulChatProvider({ children, initialState, captureState }) {
  const [projects, setProjects] = useState(initialState.projects)
  const [selectedProject, setSelectedProject] = useState(initialState.selectedProject)
  const [currentSession, setCurrentSession] = useState(initialState.currentSession)
  const [selectedDocumentIds, setSelectedDocumentIds] = useState(initialState.selectedDocumentIds)
  const [documentsRefreshToken, setDocumentsRefreshToken] = useState(initialState.documentsRefreshToken)

  const value = {
    projects,
    setProjects,
    selectedProject,
    setSelectedProject,
    currentSession,
    setCurrentSession,
    selectedDocumentIds,
    setSelectedDocumentIds,
    documentsRefreshToken,
    setDocumentsRefreshToken,
  }

  if (captureState) captureState(value)

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function renderWithChatContext(ui, options = {}) {
  const initialState = buildInitialChatState(options.initialState)
  let latestState = null

  const result = render(
    <MemoryRouter initialEntries={[options.route || '/chat']}>
      <StatefulChatProvider
        initialState={initialState}
        captureState={(state) => {
          latestState = state
        }}
      >
        {ui}
      </StatefulChatProvider>
    </MemoryRouter>
  )

  return {
    ...result,
    getChatState: () => latestState,
  }
}
