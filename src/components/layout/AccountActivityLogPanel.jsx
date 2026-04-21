import { Activity } from 'lucide-react'
import ActivityFeedItem from '../ui/ActivityFeedItem'

const FEED_ITEMS = [
    {
        title: 'Document Analyzed',
        description: '"Global Markets Q4 Report.pdf"',
        timestamp: '12 minutes ago',
    },
    {
        title: 'Team Invitation Accepted',
        description: 'Sarah Jenkins joined Workspace.',
        timestamp: '2 hours ago',
    },
    {
        title: 'Security Checkup',
        description: 'Automated archive integrity scan.',
        timestamp: 'Yesterday at 11:45 PM',
    },
]

function AccountActivityLogPanel() {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
                <h3 className="inline-flex items-center gap-2 font-['Manrope'] text-xl font-extrabold text-slate-900">
                    <Activity size={18} />
                    Activity Log
                </h3>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold tracking-wide text-emerald-700">
                    LIVE FEED
                </span>
            </div>

            <div className="mt-4 space-y-3">
                {FEED_ITEMS.map((item) => (
                    <ActivityFeedItem key={item.title} {...item} />
                ))}
            </div>

            <button
                type="button"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold tracking-wide text-slate-700"
            >
                VIEW FULL HISTORY
            </button>
        </section>
    )
}

export default AccountActivityLogPanel
