import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { AppSettingsProvider } from './context/AppSettingsContext'
import { ChatProvider } from './context/ChatProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppSettingsProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </AppSettingsProvider>
    </BrowserRouter>
  </StrictMode>,
)
