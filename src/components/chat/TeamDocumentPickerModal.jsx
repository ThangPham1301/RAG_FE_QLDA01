import { useEffect, useMemo, useState } from 'react'
import { FileText, RefreshCw, Users, X } from 'lucide-react'
import { TeamsAPI } from '../../api/client'

function TeamDocumentPickerModal({ open, chatSessionId, onClose, onAttached }) {
  const [teams, setTeams] = useState([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [teamDocuments, setTeamDocuments] = useState([])
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return
    setLoading(true)
    setError('')
    TeamsAPI.list()
      .then((response) => {
        const data = response.data.results || response.data || []
        setTeams(data)
        setSelectedTeamId(data[0]?.id ? String(data[0].id) : '')
      })
      .catch((err) => {
        console.error(err)
        setError('Cannot load teams.')
      })
      .finally(() => setLoading(false))
  }, [open])

  useEffect(() => {
    if (!open || !selectedTeamId) {
      setTeamDocuments([])
      setSelectedDocumentIds([])
      return
    }
    setLoading(true)
    setError('')
    TeamsAPI.documents(selectedTeamId)
      .then((response) => {
        const links = response.data.results || response.data || []
        setTeamDocuments(links.map((link) => link.document).filter(Boolean))
        setSelectedDocumentIds([])
      })
      .catch((err) => {
        console.error(err)
        setError('Cannot load team documents.')
      })
      .finally(() => setLoading(false))
  }, [open, selectedTeamId])

  const selectedCount = selectedDocumentIds.length
  const selectedTeam = useMemo(() => teams.find((team) => String(team.id) === String(selectedTeamId)), [teams, selectedTeamId])

  if (!open) return null

  const toggleDocument = (id) => {
    setSelectedDocumentIds((current) => (
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    ))
  }

  const attachSelected = async () => {
    if (!chatSessionId || selectedDocumentIds.length === 0) return
    try {
      setLoading(true)
      setError('')
      await TeamsAPI.attachDocumentsToChat(chatSessionId, selectedDocumentIds)
      onAttached && onAttached()
      onClose()
    } catch (err) {
      console.error(err)
      setError(err?.response?.data?.detail || err?.response?.data?.error || 'Cannot attach documents.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-700">
              <Users size={18} />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add from Team</h2>
              <p className="text-xs text-slate-500">{selectedTeam?.name || 'Select a team'}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100">
            <X size={17} />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <select
            value={selectedTeamId}
            onChange={(event) => setSelectedTeamId(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400"
          >
            {teams.map((team) => (
              <option key={team.id} value={team.id}>{team.name}</option>
            ))}
          </select>

          {error && <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</div>}

          <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200">
            {loading && (
              <div className="flex items-center gap-2 px-4 py-8 text-sm text-slate-500">
                <RefreshCw size={15} className="animate-spin" />
                Loading...
              </div>
            )}
            {!loading && teamDocuments.length === 0 && (
              <div className="px-4 py-8 text-sm text-slate-500">No shared documents in this team.</div>
            )}
            {!loading && teamDocuments.map((doc) => (
              <label key={doc.id} className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={selectedDocumentIds.includes(doc.id)}
                  onChange={() => toggleDocument(doc.id)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-700"
                />
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-600">
                  <FileText size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-800">{doc.title}</span>
                  <span className="text-xs text-slate-500">{doc.index_status || 'pending'}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-5 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Cancel
          </button>
          <button
            type="button"
            onClick={attachSelected}
            disabled={loading || selectedCount === 0}
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Attach {selectedCount || ''}
          </button>
        </div>
      </div>
    </div>
  )
}

export default TeamDocumentPickerModal
