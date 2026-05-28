import { useEffect, useState } from 'react'
import { Check, Download, Eye, RefreshCw, Send, Upload, Users, X } from 'lucide-react'
import { DocumentsAPI, TeamsAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import topbarAvatar from '../assets/library/topbar-avatar.png'

function TeamPage() {
  const [teams, setTeams] = useState([])
  const [teamDocuments, setTeamDocuments] = useState({})
  const [invitations, setInvitations] = useState([])
  const [teamName, setTeamName] = useState('')
  const [inviteEmails, setInviteEmails] = useState({})
  const [loading, setLoading] = useState(false)
  const [uploadingTeamId, setUploadingTeamId] = useState(null)
  const [message, setMessage] = useState('')

  const loadData = async () => {
    setLoading(true)
    setMessage('')
    try {
      const [teamsRes, invitationsRes] = await Promise.all([
        TeamsAPI.list(),
        TeamsAPI.invitations(),
      ])
      const teamList = teamsRes.data.results || teamsRes.data || []
      setTeams(teamList)
      setInvitations(invitationsRes.data.results || invitationsRes.data || [])
      const docsEntries = await Promise.all(
        teamList.map(async (team) => {
          const docsRes = await TeamsAPI.documents(team.id).catch(() => ({ data: [] }))
          return [team.id, docsRes.data.results || docsRes.data || []]
        })
      )
      setTeamDocuments(Object.fromEntries(docsEntries))
    } catch (error) {
      console.error(error)
      setMessage('Cannot load team data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const createTeam = async () => {
    const name = teamName.trim()
    if (!name) return
    try {
      setLoading(true)
      await TeamsAPI.create(name)
      setTeamName('')
      await loadData()
    } catch (error) {
      console.error(error)
      const data = error?.response?.data
      setMessage(data?.name?.[0] || data?.detail || data?.error || 'Cannot create team.')
      setLoading(false)
    }
  }

  const inviteUsers = async (teamId) => {
    const emails = String(inviteEmails[teamId] || '')
      .split(/[,\n]/)
      .map((email) => email.trim())
      .filter(Boolean)
    if (emails.length === 0) return
    try {
      setLoading(true)
      await TeamsAPI.invite(teamId, emails)
      setInviteEmails((current) => ({ ...current, [teamId]: '' }))
      await loadData()
    } catch (error) {
      console.error(error)
      setMessage(error?.response?.data?.error || 'Cannot send invitations.')
      setLoading(false)
    }
  }

  const respondInvitation = async (invitation, action) => {
    if (invitation.status !== 'PENDING') return
    try {
      setLoading(true)
      if (action === 'accept') await TeamsAPI.acceptInvitation(invitation.id)
      else await TeamsAPI.rejectInvitation(invitation.id)
      await loadData()
    } catch (error) {
      console.error(error)
      setMessage(error?.response?.data?.error || 'Invitation already responded.')
      setLoading(false)
    }
  }

  const uploadTeamFiles = async (teamId, files) => {
    if (!files || files.length === 0) return
    const formData = new FormData()
    for (const file of files) formData.append('files', file)
    try {
      setUploadingTeamId(teamId)
      setMessage('Uploading and indexing team documents...')
      await TeamsAPI.uploadDocuments(teamId, formData)
      setMessage('Team documents uploaded.')
      await loadData()
    } catch (error) {
      console.error(error)
      setMessage(error?.response?.data?.error || 'Cannot upload team documents.')
    } finally {
      setUploadingTeamId(null)
    }
  }

  const formatFileSize = (size) => {
    const value = Number(size || 0)
    if (!value) return '0 B'
    if (value < 1024) return `${value} B`
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`
    return `${(value / 1024 / 1024).toFixed(1)} MB`
  }

  const formatDate = (value) => {
    if (!value) return '-'
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('vi-VN')
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <ArchiveSidebar activeItem="Team" ctaLabel="NEW TEAM" />
        <div className="flex min-h-screen flex-1 flex-col">
          <WorkspaceTopBar
            profileName="Workspace"
            profileRole="Team Management"
            avatarSrc={topbarAvatar}
          />
          <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
            <div className="mx-auto max-w-6xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="font-['Manrope'] text-3xl font-extrabold text-slate-950">Team Management</h1>
                  <p className="mt-1 text-sm text-slate-600">Create teams, invite members, and manage invitation responses.</p>
                </div>
                <button type="button" onClick={loadData} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                  <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {message && <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">{message}</div>}

              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                <h2 className="text-lg font-bold text-slate-900">Create Team</h2>
                <div className="mt-4 flex gap-2">
                  <input
                    value={teamName}
                    onChange={(event) => setTeamName(event.target.value)}
                    placeholder="Team name"
                    className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                  />
                  <button type="button" onClick={createTeam} disabled={loading || !teamName.trim()} className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    Create
                  </button>
                </div>
              </section>

              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                <h2 className="text-lg font-bold text-slate-900">Invitations</h2>
                <div className="mt-4 space-y-2">
                  {invitations.length === 0 && <p className="text-sm text-slate-500">No invitations.</p>}
                  {invitations.map((invitation) => (
                    <div key={invitation.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3">
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{invitation.team_name}</div>
                        <div className="text-xs text-slate-500">From {invitation.invited_by_email} • {invitation.status}</div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => respondInvitation(invitation, 'accept')}
                          disabled={loading || invitation.status !== 'PENDING'}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 disabled:opacity-40"
                        >
                          <Check size={13} />
                          Accept
                        </button>
                        <button
                          type="button"
                          onClick={() => respondInvitation(invitation, 'reject')}
                          disabled={loading || invitation.status !== 'PENDING'}
                          className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700 disabled:opacity-40"
                        >
                          <X size={13} />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4 lg:grid-cols-2">
                {teams.map((team) => (
                  <article key={team.id} className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-700">
                        <Users size={18} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-bold text-slate-900">{team.name}</h3>
                        <p className="text-xs text-slate-500">{team.member_count} members</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {(team.members || []).map((member) => (
                        <div key={member.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
                          <span className="truncate text-slate-700">{member.email}</span>
                          <span className="text-xs font-semibold uppercase text-slate-400">{member.role}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <input
                        value={inviteEmails[team.id] || ''}
                        onChange={(event) => setInviteEmails((current) => ({ ...current, [team.id]: event.target.value }))}
                        placeholder="email1@gmail.com, email2@gmail.com"
                        className="min-w-0 flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-400"
                      />
                      <button type="button" onClick={() => inviteUsers(team.id)} disabled={loading} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50">
                        <Send size={14} />
                        Invite
                      </button>
                    </div>

                    <div className="mt-3">
                      <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400">
                        <Upload size={14} />
                        {uploadingTeamId === team.id ? 'Uploading...' : 'Upload shared documents'}
                        <input
                          type="file"
                          multiple
                          hidden
                          disabled={uploadingTeamId === team.id}
                          onChange={(event) => uploadTeamFiles(team.id, event.target.files)}
                        />
                      </label>
                    </div>

                    <div className="mt-5 rounded-xl border border-slate-200">
                      <div className="border-b border-slate-200 px-3 py-2">
                        <h4 className="text-sm font-bold text-slate-900">Team Documents</h4>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {(teamDocuments[team.id] || []).length === 0 && (
                          <div className="px-3 py-5 text-sm text-slate-500">No uploaded team documents.</div>
                        )}
                        {(teamDocuments[team.id] || []).map((link) => {
                          const doc = link.document || {}
                          return (
                            <div key={link.id} className="border-b border-slate-100 px-3 py-3 last:border-b-0">
                              <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                  <div className="truncate text-sm font-semibold text-slate-900">{link.file_name || doc.title}</div>
                                  <div className="mt-1 text-xs text-slate-500">
                                    {(link.file_type || doc.file_type || 'file').toUpperCase()} • {formatFileSize(link.file_size || doc.file_size)} • Uploaded by {link.uploaded_by_email || doc.uploaded_by_email || '-'} • {formatDate(link.created_at || doc.uploaded_at)}
                                  </div>
                                </div>
                                <div className="flex shrink-0 gap-1">
                                  <a
                                    href={DocumentsAPI.previewUrl(doc.id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="rounded-lg bg-indigo-50 p-2 text-indigo-700 hover:bg-indigo-100"
                                    title="View document"
                                  >
                                    <Eye size={14} />
                                  </a>
                                  <a
                                    href={DocumentsAPI.previewUrl(doc.id)}
                                    download={doc.title}
                                    className="rounded-lg bg-slate-50 p-2 text-slate-700 hover:bg-slate-100"
                                    title="Download document"
                                  >
                                    <Download size={14} />
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default TeamPage
