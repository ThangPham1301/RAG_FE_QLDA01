import { ArrowUpRight } from 'lucide-react'

function LibraryStatCard({ icon, value, change, title }) {
    return (
        <article className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-slate-600">{title}</p>
                    <p className="mt-3 font-['Manrope'] text-4xl font-extrabold text-slate-900">{value}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#e5eeff]">
                    {icon}
                </div>
            </div>
            {change && (
                <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <ArrowUpRight size={12} />
                    {change}
                </span>
            )}
        </article>
    )
}

export default LibraryStatCard
