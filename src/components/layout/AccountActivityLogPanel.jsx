import { useEffect, useState } from 'react'
import { Activity, RefreshCw } from 'lucide-react'
import { AccountLogsAPI } from '../../api/client'
import AccountLogList from './AccountLogList'

function AccountActivityLogPanel() {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const loadLogs = async () => {
        setLoading(true)
        setError('')
        try {
            const response = await AccountLogsAPI.mine()
            setLogs(response.data?.logs || [])
        } catch (err) {
            setError(err.response?.data?.detail || err.message || 'Cannot load activity logs.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadLogs()
    }, [])

    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3 className="inline-flex items-center gap-2 font-['Manrope'] text-xl font-extrabold text-slate-900">
                        <Activity size={18} />
                        My Activity Logs
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">Recent login sessions, OTP events, and password reset activity.</p>
                </div>
                <button
                    type="button"
                    onClick={loadLogs}
                    disabled={loading}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                </div>
            )}

            <div className="mt-4">
                <AccountLogList logs={logs} emptyText={loading ? 'Loading activity logs...' : 'No activity logs yet.'} />
            </div>
        </section>
    )
}

export default AccountActivityLogPanel
