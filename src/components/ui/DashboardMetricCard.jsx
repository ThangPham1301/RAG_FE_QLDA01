import { ArrowUpRight } from 'lucide-react'

function DashboardMetricCard({ icon, title, value, badge, badgeTone = 'emerald' }) {
    const badgeToneClass =
        badgeTone === 'blue'
            ? 'bg-blue-100 text-blue-700'
            : badgeTone === 'amber'
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-700'

    return (
        <article className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#e5eeff] text-blue-800">
                    {icon}
                </div>
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${badgeToneClass}`}
                >
                    <ArrowUpRight size={12} />
                    {badge}
                </span>
            </div>
            <p className="mt-5 text-xs font-bold tracking-[0.12em] text-slate-500">{title}</p>
            <p className="mt-2 font-['Manrope'] text-3xl font-extrabold text-slate-900">{value}</p>
        </article>
    )
}

export default DashboardMetricCard
