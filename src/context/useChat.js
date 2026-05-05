import { useContext } from 'react'
import { ChatContext } from './chatContext'

export function useChat() {
  return useContext(ChatContext)
}
