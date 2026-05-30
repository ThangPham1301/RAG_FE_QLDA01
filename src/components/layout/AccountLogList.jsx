import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Clock, KeyRound, Laptop, MapPin, Search, ShieldCheck, ShieldX } from 'lucide-react'

const PAGE_SIZE = 10

const formatDate = (value) => {
  if (!value) return 'N/A'
  return new Date(value).toLocaleString()
}

const formatBool = (value) => (value ? 'Yes' : 'No')

const purposeLabel = (value) => {
  if (value === 'login_2fa') return 'Login 2FA'
  if (value === 'password_reset') return 'Password reset'
  if (value === 'signup') return 'Signup verification'
  return value || 'N/A'
}

const getLogIcon = (item) => {
  if (item.type === 'otp') return KeyRound
  if (item.type === 'password_reset') return ShieldX
  if (item.metadata?.revoked_at) return ShieldX
  return ShieldCheck
}

const getLogTone = (item) => {
  if (item.type === 'password_reset' || item.metadata?.revoked_at) return 'text-amber-700 bg-amber-50 ring-amber-100'
  if (item.type === 'otp') return 'text-blue-700 bg-blue-50 ring-blue-100'
  return 'text-emerald-700 bg-emerald-50 ring-emerald-100'
}

function DetailPill({ icon: Icon, label, value }) {
  if (value === undefined || value === null || value === '') return null
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 ring-1 ring-slate-100">
      {Icon && <Icon size={12} />}
      <span className="text-slate-400">{label}:</span>
      <span className="max-w-[320px] truncate text-slate-700">{value}</span>
    </span>
  )
}

function AccountLogList({ logs = [], emptyText = 'No activity logs yet.' }) {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const filteredLogs = useMemo(() => {
    const term = query.trim().toLowerCase()
    return logs.filter((item) => {
      const metadata = item.metadata || {}
      const matchesType = typeFilter === 'all' || item.type === typeFilter
      const matchesStatus = (() => {
        if (statusFilter === 'all') return true
        if (statusFilter === 'active_session') return item.type === 'session' && !metadata.revoked_at
        if (statusFilter === 'revoked_session') return item.type === 'session' && Boolean(metadata.revoked_at)
        if (statusFilter === 'used') return Boolean(metadata.is_used)
        if (statusFilter === 'unused') return metadata.is_used === false
        if (statusFilter === 'verified') return Boolean(metadata.verified_at)
        if (statusFilter === 'not_verified') return item.type === 'otp' && !metadata.verified_at
        return true
      })()
      const haystack = [
        item.title,
        item.type,
        metadata.device,
        metadata.ip_address,
        metadata.purpose,
      ].filter(Boolean).join(' ').toLowerCase()
      const matchesQuery = !term || haystack.includes(term)
      return matchesType && matchesStatus && matchesQuery
    })
  }, [logs, query, typeFilter, statusFilter])
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const pageLogs = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filteredLogs.slice(start, start + PAGE_SIZE)
  }, [filteredLogs, page])

  useEffect(() => {
    setPage(1)
  }, [logs, query, typeFilter, statusFilter])

  if (!logs.length) {
    return <div className="rounded-xl border border-dashed border-slate-200 px-4 py-8 text-sm text-slate-500">{emptyText}</div>
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="grid gap-3 border-b border-slate-100 bg-slate-50 p-3 md:grid-cols-[1fr_180px_190px]">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <Search size={15} className="text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search title, device, IP..."
            className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
        >
          <option value="all">All types</option>
          <option value="session">Sessions</option>
          <option value="otp">OTP</option>
          <option value="password_reset">Password reset</option>
        </select>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 outline-none"
        >
          <option value="all">All statuses</option>
          <option value="active_session">Active sessions</option>
          <option value="revoked_session">Revoked sessions</option>
          <option value="used">Used tokens</option>
          <option value="unused">Unused tokens</option>
          <option value="verified">Verified OTP</option>
          <option value="not_verified">Unverified OTP</option>
        </select>
      </div>
      <div>
        {pageLogs.length === 0 ? (
          <div className="px-4 py-8 text-sm text-slate-500">No logs match the current filters.</div>
        ) : pageLogs.map((item) => {
          const Icon = getLogIcon(item)
          const metadata = item.metadata || {}
          const tone = getLogTone(item)

          return (
            <article key={`${item.type}-${item.id}`} className="border-b border-slate-100 p-4 last:border-b-0">
              <div className="flex items-start gap-3">
                <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl ring-1 ${tone}`}>
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <span className="text-xs font-medium text-slate-500">{formatDate(item.created_at)}</span>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.type === 'session' && (
                      <>
                        <DetailPill icon={Laptop} label="Device" value={metadata.device || 'Unknown device'} />
                        <DetailPill icon={MapPin} label="IP" value={metadata.ip_address || 'Unknown'} />
                        <DetailPill icon={Clock} label="Last active" value={formatDate(metadata.last_activity_at)} />
                        <DetailPill icon={ShieldX} label="Revoked" value={metadata.revoked_at ? formatDate(metadata.revoked_at) : 'No'} />
                      </>
                    )}

                    {item.type === 'otp' && (
                      <>
                        <DetailPill icon={KeyRound} label="Purpose" value={purposeLabel(metadata.purpose)} />
                        <DetailPill icon={ShieldCheck} label="Used" value={formatBool(metadata.is_used)} />
                        <DetailPill icon={Clock} label="Expires" value={formatDate(metadata.expires_at)} />
                        <DetailPill icon={Clock} label="Verified" value={metadata.verified_at ? formatDate(metadata.verified_at) : 'Not verified'} />
                        <DetailPill label="Attempts" value={String(metadata.attempts ?? 0)} />
                      </>
                    )}

                    {item.type === 'password_reset' && (
                      <>
                        <DetailPill icon={ShieldCheck} label="Used" value={formatBool(metadata.is_used)} />
                        <DetailPill icon={Clock} label="Expires" value={formatDate(metadata.expires_at)} />
                        <DetailPill icon={Clock} label="Reset at" value={metadata.reset_at ? formatDate(metadata.reset_at) : 'Not reset'} />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50 px-4 py-3">
        <span className="text-xs font-medium text-slate-500">
          Showing {filteredLogs.length ? (page - 1) * PAGE_SIZE + 1 : 0}-{Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length} logs
          {filteredLogs.length !== logs.length ? ` (${logs.length} total)` : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={page === 1}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft size={14} />
            Prev
          </button>
          <span className="min-w-16 text-center text-xs font-semibold text-slate-600">
            {page}/{totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={page === totalPages}
            className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default AccountLogList
