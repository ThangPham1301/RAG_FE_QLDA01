import { useCallback, useEffect, useState } from 'react'
import {
  Eye,
  EyeOff,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  X,
} from 'lucide-react'
import avatarProfile from '../assets/dashboard/avatar-profile.png'
import { AdminUsersAPI } from '../api/client'
import ArchiveSidebar from '../components/layout/ArchiveSidebar'
import WorkspaceTopBar from '../components/layout/WorkspaceTopBar'
import { useAuth } from '../context/AuthContext'

const formatDate = (value) => {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

const getRole = (user) => (user?.role === 'admin' || user?.is_staff || user?.is_superuser ? 'admin' : 'user')

function UserManagementPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [logsUser, setLogsUser] = useState(null)
  const [logs, setLogs] = useState([])
  const [confirmAction, setConfirmAction] = useState(null)
  const [passwordTarget, setPasswordTarget] = useState(null)
  const [passwordForm, setPasswordForm] = useState({ password: '', passwordConfirm: '' })
  const [showPassword, setShowPassword] = useState({ password: false, passwordConfirm: false })
  const [filters, setFilters] = useState({ search: '', role: '', status: '' })
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, count: 0 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')
    try {
      const response = await AdminUsersAPI.list({
        ...filters,
        page,
        page_size: 12,
      })
      setUsers(response.data.results || [])
      setPagination({
        page: response.data.page || page,
        totalPages: response.data.total_pages || 1,
        count: response.data.count || 0,
      })
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Unable to load users')
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    loadUsers(1)
  }, [filters, loadUsers])

  const updateUser = async (targetUser, payload, successMessage) => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await AdminUsersAPI.update(targetUser.id, payload)
      setUsers((list) => list.map((item) => (item.id === targetUser.id ? response.data : item)))
      setMessage(successMessage)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Unable to update user')
    } finally {
      setSaving(false)
    }
  }

  const askConfirm = (config) => {
    setConfirmAction(config)
  }

  const handleConfirmAction = async () => {
    if (!confirmAction?.onConfirm) return
    await confirmAction.onConfirm()
    setConfirmAction(null)
  }

  const requestRoleChange = (targetUser, role) => {
    if (role === getRole(targetUser)) return
    askConfirm({
      tone: 'warning',
      title: 'Confirm role change',
      description: `Are you sure you want to change ${targetUser.email} to ${role === 'admin' ? 'Admin' : 'User'}?`,
      confirmLabel: 'Change role',
      onConfirm: () => updateUser(targetUser, { role }, 'User role updated.'),
    })
  }

  const requestToggleLock = (targetUser) => {
    const nextActive = !targetUser.is_active
    askConfirm({
      tone: nextActive ? 'warning' : 'danger',
      title: nextActive ? 'Unlock account?' : 'Lock account?',
      description: nextActive
        ? `Are you sure you want to unlock ${targetUser.email}?`
        : `Are you sure you want to lock ${targetUser.email}? This will revoke active sessions.`,
      confirmLabel: nextActive ? 'Unlock account' : 'Lock account',
      onConfirm: () => updateUser(targetUser, { is_active: nextActive }, nextActive ? 'User unlocked.' : 'User locked.'),
    })
  }

  const requestDeleteUser = (targetUser) => {
    askConfirm({
      tone: 'danger',
      title: 'Delete account?',
      description: `Are you sure you want to delete ${targetUser.email}? This action cannot be undone.`,
      confirmLabel: 'Delete account',
      onConfirm: () => handleDeleteUser(targetUser),
    })
  }

  const handleDeleteUser = async (targetUser) => {
    setSaving(true)
    setError('')
    setMessage('')
    try {
      await AdminUsersAPI.delete(targetUser.id)
      setUsers((list) => list.filter((item) => item.id !== targetUser.id))
      setMessage('User account deleted.')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Unable to delete user')
    } finally {
      setSaving(false)
    }
  }

  const openPasswordModal = (targetUser) => {
    setPasswordTarget(targetUser)
    setPasswordForm({ password: '', passwordConfirm: '' })
    setShowPassword({ password: false, passwordConfirm: false })
    setError('')
    setMessage('')
  }

  const closePasswordModal = () => {
    setPasswordTarget(null)
    setPasswordForm({ password: '', passwordConfirm: '' })
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()
    if (!passwordTarget) return

    if (!passwordForm.password || !passwordForm.passwordConfirm) {
      setError('Password and confirmation are required.')
      return
    }
    if (passwordForm.password !== passwordForm.passwordConfirm) {
      setError('Passwords do not match.')
      return
    }
    if (passwordForm.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setSaving(true)
    setError('')
    setMessage('')
    try {
      const response = await AdminUsersAPI.resetPassword(passwordTarget.id, {
        password: passwordForm.password,
        password_confirm: passwordForm.passwordConfirm,
      })
      setMessage(response.data.message || 'Password updated.')
      closePasswordModal()
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Unable to update password')
    } finally {
      setSaving(false)
    }
  }

  const handleViewLogs = async (targetUser) => {
    setSaving(true)
    setError('')
    try {
      const response = await AdminUsersAPI.logs(targetUser.id)
      setLogsUser(response.data.user)
      setLogs(response.data.sessions || [])
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Unable to load user logs')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <ArchiveSidebar activeItem="Users" ctaLabel="ADMIN TOOLS" />
        <div className="flex min-h-screen flex-1 flex-col">
          <WorkspaceTopBar profileName="Admin" profileRole="User management" avatarSrc={avatarProfile} />

          <div className="flex-1 overflow-y-auto bg-[#f8f9ff] p-6 lg:p-8">
            <div className="mx-auto max-w-7xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="font-['Manrope'] text-2xl font-extrabold text-slate-900">User Management</h1>
                  <p className="mt-1 text-sm text-slate-600">Manage accounts, access status, roles, groups, permissions, and login logs.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    loadUsers(pagination.page)
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white"
                >
                  <RefreshCw size={16} />
                  Refresh
                </button>
              </div>

              {(message || error) && (
                <div className={`rounded-xl px-4 py-3 text-sm ${error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {error || message}
                </div>
              )}

              <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
                <div className="grid gap-3 lg:grid-cols-[1fr_160px_160px]">
                  <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
                    <Search size={16} className="text-slate-400" />
                    <input
                      value={filters.search}
                      onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                      placeholder="Search by email, name, username"
                      className="w-full bg-transparent text-sm outline-none"
                    />
                  </label>
                  <select
                    value={filters.role}
                    onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                  >
                    <option value="">All roles</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                  <select
                    value={filters.status}
                    onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none"
                  >
                    <option value="">All status</option>
                    <option value="active">Active</option>
                    <option value="locked">Locked</option>
                  </select>
                </div>

                <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full min-w-[860px] text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                      <tr>
                        <th className="px-4 py-3">User</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Last Login</th>
                        <th className="px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">Loading users...</td></tr>
                      ) : users.length === 0 ? (
                        <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">No users found.</td></tr>
                      ) : users.map((item) => {
                        const isSelf = item.id === currentUser?.id
                        return (
                          <tr key={item.id} className="border-t border-slate-100 align-top">
                            <td className="px-4 py-3">
                              <div className="font-semibold text-slate-900">{item.first_name || item.last_name ? `${item.first_name || ''} ${item.last_name || ''}`.trim() : item.username}</div>
                              <div className="text-xs text-slate-500">{item.email}</div>
                              <div className="mt-1 text-[11px] text-slate-400">Joined {formatDate(item.date_joined || item.created_at)}</div>
                            </td>
                            <td className="px-4 py-3">
                              <select
                                value={getRole(item)}
                                disabled={saving || isSelf}
                                onChange={(event) => requestRoleChange(item, event.target.value)}
                                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
                              >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                                {item.is_active ? 'Active' : 'Locked'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-600">{formatDate(item.last_login_at)}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() => requestToggleLock(item)}
                                  disabled={saving || isSelf}
                                  title={item.is_active ? 'Lock account' : 'Unlock account'}
                                  className="rounded-lg border border-slate-200 p-2 text-slate-700 disabled:opacity-40"
                                >
                                  {item.is_active ? <Lock size={15} /> : <Unlock size={15} />}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openPasswordModal(item)}
                                  disabled={saving}
                                  title="Set new password"
                                  className="rounded-lg border border-slate-200 p-2 text-blue-700 disabled:opacity-40"
                                >
                                  <ShieldCheck size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleViewLogs(item)}
                                  disabled={saving}
                                  title="View user logs"
                                  className="rounded-lg border border-slate-200 p-2 text-slate-700 disabled:opacity-40"
                                >
                                  <Eye size={15} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => requestDeleteUser(item)}
                                  disabled={saving || isSelf}
                                  title="Delete account"
                                  className="rounded-lg border border-rose-200 p-2 text-rose-700 disabled:opacity-40"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-slate-500">{pagination.count} users, page {pagination.page} of {pagination.totalPages}</p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={pagination.page <= 1}
                      onClick={() => loadUsers(pagination.page - 1)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => loadUsers(pagination.page + 1)}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      {logsUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">User Logs</h2>
                <p className="mt-1 text-sm text-slate-600">{logsUser.email}</p>
              </div>
              <button type="button" onClick={() => setLogsUser(null)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                <X size={18} />
              </button>
            </div>
            <div className="mt-4 max-h-[25rem] overflow-y-auto rounded-xl border border-slate-200">
              {logs.length === 0 ? (
                <div className="px-4 py-6 text-sm text-slate-500">No login sessions recorded.</div>
              ) : logs.map((log) => (
                <div key={log.id} className="grid gap-2 border-t border-slate-100 px-4 py-3 text-sm first:border-t-0 md:grid-cols-[1fr_130px_160px]">
                  <div>
                    <div className="font-semibold text-slate-900">{log.device_name || 'Unknown device'}</div>
                    <div className="text-xs text-slate-500">{log.ip_address}</div>
                  </div>
                  <span className={`h-fit rounded-full px-3 py-1 text-xs font-bold ${log.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {log.is_active ? 'Active' : 'Revoked'}
                  </span>
                  <div className="text-xs text-slate-500">
                    <div>{formatDate(log.created_at)}</div>
                    <div>Last {formatDate(log.last_activity_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {passwordTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Set New Password</h2>
                <p className="mt-1 text-sm text-slate-600">{passwordTarget.email}</p>
              </div>
              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close password modal"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="admin-new-password">
                  New password
                </label>
                <div className="relative">
                  <input
                    id="admin-new-password"
                    type={showPassword.password ? 'text' : 'password'}
                    value={passwordForm.password}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm outline-none focus:border-blue-500"
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => ({ ...current, password: !current.password }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={showPassword.password ? 'Hide password' : 'Show password'}
                  >
                    {showPassword.password ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="admin-confirm-password">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    id="admin-confirm-password"
                    type={showPassword.passwordConfirm ? 'text' : 'password'}
                    value={passwordForm.passwordConfirm}
                    onChange={(event) => setPasswordForm((current) => ({ ...current, passwordConfirm: event.target.value }))}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 pr-11 text-sm outline-none focus:border-blue-500"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => ({ ...current, passwordConfirm: !current.passwordConfirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                    aria-label={showPassword.passwordConfirm ? 'Hide password confirmation' : 'Show password confirmation'}
                  >
                    {showPassword.passwordConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-amber-50 px-4 py-3 text-xs font-medium text-amber-800">
                This will revoke all active sessions for this user.
              </div>
              <div className="flex justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={closePasswordModal}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Update password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">{confirmAction.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{confirmAction.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close confirmation"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirmAction(null)}
                disabled={saving}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                disabled={saving}
                className={`rounded-xl px-4 py-2 text-sm font-semibold text-white disabled:opacity-50 ${
                  confirmAction.tone === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-slate-950 hover:bg-slate-800'
                }`}
              >
                {saving ? 'Processing...' : confirmAction.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default UserManagementPage
