import { useCallback, useEffect, useState } from 'react'
import { ClipboardList, Eye, EyeOff, KeyRound, Lock, RefreshCw, Search, Trash2, Unlock, UsersRound, X } from 'lucide-react'
import { AdminUsersAPI } from '../../api/client'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'
import AccountLogList from './AccountLogList'

const fillTemplate = (template, values = {}) => (
  Object.entries(values).reduce((text, [key, value]) => text.replace(`{${key}}`, value), template)
)

function AdminUserManagementPanel() {
  const { t } = useAppSettings()
  const { user: currentUser } = useAuth()
  const labels = t.adminUsers
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([])
  const [filters, setFilters] = useState({ search: '', role: '', status: '' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [logs, setLogs] = useState([])
  const [resetTarget, setResetTarget] = useState(null)
  const [resetForm, setResetForm] = useState({ password: '', passwordConfirm: '' })
  const [showResetPassword, setShowResetPassword] = useState({ password: false, confirm: false })
  const [confirmDialog, setConfirmDialog] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await AdminUsersAPI.listUsers({
        search: filters.search || undefined,
        role: filters.role || undefined,
        status: filters.status || undefined,
      })
      setUsers(response.data?.results || response.data || [])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || labels.messages.usersLoadFailed)
    } finally {
      setLoading(false)
    }
  }, [filters, labels.messages.usersLoadFailed])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const runAction = async (action, successMessage) => {
    setError('')
    setMessage('')
    try {
      await action()
      setMessage(successMessage)
      await loadUsers()
      if (selectedUser) {
        const response = await AdminUsersAPI.logs(selectedUser.id)
        setSelectedUser(response.data.user)
        setLogs(response.data.logs || [])
      }
    } catch (err) {
      setError(err.response?.data?.detail || err.message || labels.messages.actionFailed)
    }
  }

  const showLogs = async (user) => {
    setSelectedUser(user)
    setLogs([])
    setActiveTab('logs')
    try {
      const response = await AdminUsersAPI.logs(user.id)
      setSelectedUser(response.data.user)
      setLogs(response.data.logs || [])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || labels.messages.logsLoadFailed)
    }
  }

  const submitResetPassword = async (event) => {
    event.preventDefault()
    if (!resetTarget) return
    setConfirmDialog({
      title: labels.reset.title,
      message: fillTemplate(labels.messages.resetPasswordConfirm, { email: resetTarget.email }),
      tone: 'warning',
      confirmLabel: labels.actions.reset,
      onConfirm: async () => {
        await runAction(
          () => AdminUsersAPI.resetPassword(resetTarget.id, resetForm.password, resetForm.passwordConfirm),
          labels.messages.passwordReset
        )
        setResetTarget(null)
        setResetForm({ password: '', passwordConfirm: '' })
        setShowResetPassword({ password: false, confirm: false })
      },
    })
  }

  const isCurrentUser = (targetUser) => String(targetUser.id) === String(currentUser?.id)

  const roleDisplay = (role) => {
    if (role === 'superadmin') return 'Superadmin'
    if (role === 'admin') return 'Admin'
    return 'User'
  }

  const handleRoleChange = (targetUser, nextRole) => {
    if (nextRole === targetUser.role) return
    setConfirmDialog({
      title: labels.columns.role,
      message: fillTemplate(labels.messages.roleChangeConfirm, {
        email: targetUser.email,
        role: roleDisplay(nextRole),
      }),
      tone: 'warning',
      confirmLabel: labels.actions.edit,
      onConfirm: () => runAction(() => AdminUsersAPI.setRole(targetUser.id, nextRole), labels.messages.roleUpdated),
    })
  }

  const handleStatusToggle = (targetUser) => {
    const nextActive = !targetUser.is_active
    const confirmTemplate = nextActive ? labels.messages.unlockConfirm : labels.messages.lockConfirm
    setConfirmDialog({
      title: nextActive ? labels.actions.unlock : labels.actions.lock,
      message: fillTemplate(confirmTemplate, { email: targetUser.email }),
      tone: nextActive ? 'neutral' : 'warning',
      confirmLabel: nextActive ? labels.actions.unlock : labels.actions.lock,
      onConfirm: () => runAction(
        () => AdminUsersAPI.setStatus(targetUser.id, nextActive),
        nextActive ? labels.messages.accountUnlocked : labels.messages.accountLocked
      ),
    })
  }

  const handleDeleteUser = (targetUser) => {
    setConfirmDialog({
      title: labels.actions.delete,
      message: fillTemplate(labels.messages.deleteUserConfirm, { email: targetUser.email }),
      tone: 'danger',
      confirmLabel: labels.actions.delete,
      onConfirm: () => runAction(() => AdminUsersAPI.deleteUser(targetUser.id), labels.messages.userDeleted),
    })
  }

  const closeConfirmDialog = () => setConfirmDialog(null)

  const confirmAction = async () => {
    if (!confirmDialog?.onConfirm) return
    const action = confirmDialog.onConfirm
    setConfirmDialog(null)
    await action()
  }

  return (
    <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">{labels.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{labels.panelDescription}</p>
        </div>
        <div className="flex rounded-xl border border-slate-200 bg-slate-50 p-1 text-sm font-semibold">
          {[
            ['users', labels.tabs.users],
            ['logs', labels.tabs.logs],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`rounded-lg px-3 py-2 transition ${activeTab === id ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {(message || error) && (
        <div className={`mt-4 rounded-xl px-4 py-3 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
          {error || message}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-64 flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
              <Search size={16} className="text-slate-400" />
              <input
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder={labels.searchPlaceholder}
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <select value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="">{labels.allRoles}</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <option value="">{labels.allStatuses}</option>
              <option value="active">{labels.activeOnly}</option>
              <option value="locked">{labels.lockedOnly}</option>
            </select>
            <button type="button" onClick={loadUsers} className="inline-flex items-center gap-2 rounded-xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white">
              <RefreshCw size={15} /> {labels.reload}
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200">
            <div className="grid grid-cols-[minmax(240px,1.35fr)_140px_120px_minmax(260px,0.9fr)] gap-4 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
              <span>{labels.columns.user}</span>
              <span>{labels.columns.role}</span>
              <span>{labels.columns.status}</span>
              <span>{labels.columns.actions}</span>
            </div>
            {loading ? (
              <div className="px-4 py-6 text-sm text-slate-500">{labels.states.loading}</div>
            ) : users.length === 0 ? (
              <div className="px-4 py-6 text-sm text-slate-500">{labels.states.emptyUsers}</div>
            ) : users.map((user) => {
              const selfRow = isCurrentUser(user)
              const rootAdminRow = Boolean(user.is_superuser)
              const protectedRow = selfRow || rootAdminRow

              return (
              <div key={user.id} className={`grid grid-cols-[minmax(240px,1.35fr)_140px_120px_minmax(260px,0.9fr)] items-center gap-4 border-t border-slate-100 px-4 py-3 text-sm text-slate-700 ${selfRow ? 'bg-slate-50/60' : ''}`}>
                <div className="min-w-0">
                  <div className="truncate font-semibold text-slate-900">{user.full_name || user.email}</div>
                  <div className="truncate text-xs text-slate-500">{user.email}</div>
                </div>
                <select
                  value={user.role}
                  onChange={(event) => handleRoleChange(user, event.target.value)}
                  disabled={protectedRow}
                  title={selfRow ? 'You cannot change your own role' : rootAdminRow ? 'Root admin role cannot be changed' : ''}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 outline-none disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 disabled:opacity-60"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  {rootAdminRow && <option value="superadmin">Superadmin</option>}
                </select>
                <span className={`inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-bold ${user.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {user.is_active ? labels.status.active : labels.status.locked}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    title={selfRow ? 'You cannot lock your own account' : rootAdminRow ? 'Root admin account cannot be locked' : (user.is_active ? labels.actions.lock : labels.actions.unlock)}
                    disabled={protectedRow}
                    onClick={() => handleStatusToggle(user)}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1.5 text-xs font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {user.is_active ? <Lock size={13} /> : <Unlock size={13} />}
                    {user.is_active ? labels.actions.lock : labels.actions.unlock}
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetTarget(user)}
                    disabled={rootAdminRow}
                    title={rootAdminRow ? 'Root admin password cannot be reset here' : labels.actions.reset}
                    className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2 py-1.5 text-xs font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <KeyRound size={13} /> {labels.actions.reset}
                  </button>
                  <button type="button" onClick={() => showLogs(user)} className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1.5 text-xs font-semibold text-amber-700">
                    <ClipboardList size={13} /> {labels.actions.log}
                  </button>
                  <button type="button" disabled={protectedRow} title={selfRow ? 'You cannot delete your own account' : rootAdminRow ? 'Root admin account cannot be deleted' : labels.actions.delete} onClick={() => handleDeleteUser(user)} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700 disabled:cursor-not-allowed disabled:opacity-40">
                    <Trash2 size={13} /> {labels.actions.delete}
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="mt-5 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 font-bold text-slate-900">
            <UsersRound size={17} /> {selectedUser ? `Log: ${selectedUser.email}` : labels.logs.emptyTitle}
          </div>
          <div className="p-4">
            <AccountLogList logs={logs} emptyText={labels.logs.empty} />
          </div>
        </div>
      )}

      {resetTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form onSubmit={submitResetPassword} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-extrabold text-slate-900">{labels.reset.title}</h3>
              <button type="button" onClick={() => setResetTarget(null)} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"><X size={20} /></button>
            </div>
            <p className="mt-1 text-sm text-slate-600">{resetTarget.email}</p>
            <div className="mt-5 space-y-3">
              <div className="relative">
                <input
                  type={showResetPassword.password ? 'text' : 'password'}
                  value={resetForm.password}
                  onChange={(event) => setResetForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder={labels.reset.newPassword}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword((current) => ({ ...current, password: !current.password }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
                  aria-label={showResetPassword.password ? 'Hide password' : 'Show password'}
                >
                  {showResetPassword.password ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showResetPassword.confirm ? 'text' : 'password'}
                  value={resetForm.passwordConfirm}
                  onChange={(event) => setResetForm((current) => ({ ...current, passwordConfirm: event.target.value }))}
                  placeholder={labels.reset.confirmPassword}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowResetPassword((current) => ({ ...current, confirm: !current.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-800"
                  aria-label={showResetPassword.confirm ? 'Hide password confirmation' : 'Show password confirmation'}
                >
                  {showResetPassword.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <button type="submit" className="w-full rounded-xl bg-blue-900 px-4 py-2 text-sm font-semibold text-white">{labels.reset.submit}</button>
            </div>
          </form>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.28)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-['Manrope'] text-xl font-extrabold text-slate-900">
                  {confirmDialog.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {confirmDialog.message}
                </p>
              </div>
              <button type="button" onClick={closeConfirmDialog} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100">
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirmDialog}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                {labels.actions.cancel}
              </button>
              <button
                type="button"
                onClick={confirmAction}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
                  confirmDialog.tone === 'danger'
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : confirmDialog.tone === 'warning'
                      ? 'bg-amber-600 hover:bg-amber-500'
                      : 'bg-blue-900 hover:bg-blue-800'
                }`}
              >
                {confirmDialog.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default AdminUserManagementPanel
