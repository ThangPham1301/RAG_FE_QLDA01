import { FilePlus2, FolderPlus, ShieldAlert, Sparkles } from 'lucide-react'
import ActivityListItem from '../ui/ActivityListItem'

const ACTIVITIES = [
    {
        title: 'Neuro-AI Paper Indexed',
        description: 'Dr. Thorne uploaded "Neural Synapse Mapping in LLMs"',
        timestamp: '2 MINUTES AGO',
        icon: <FilePlus2 size={16} />,
    },
    {
        title: 'Team Research Call',
        description: 'New shared folder "Project Horizon" created by Sarah Jenkins',
        timestamp: '1 HOUR AGO',
        icon: <FolderPlus size={16} />,
    },
    {
        title: 'Summary Generated',
        description: 'Cognitive Slate finalized the 50-page ethics review summary',
        timestamp: '4 HOURS AGO',
        icon: <Sparkles size={16} />,
    },
    {
        title: 'Storage Alert',
        description: 'Workspace storage exceeded 12TB. Consider optimizing legacy files.',
        timestamp: 'YESTERDAY',
        icon: <ShieldAlert size={16} />,
    },
]

function DashboardRecentActivityPanel() {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Recent Activity</h2>
                <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
            </div>

            <div className="mt-4 space-y-3">
                {ACTIVITIES.map((item) => (
                    <ActivityListItem key={item.title} {...item} />
                ))}
            </div>

            <button
                type="button"
                className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold tracking-[0.08em] text-slate-700 transition hover:border-slate-300"
            >
                VIEW FULL AUDIT LOG
            </button>
        </section>
    )
}

export default DashboardRecentActivityPanel
