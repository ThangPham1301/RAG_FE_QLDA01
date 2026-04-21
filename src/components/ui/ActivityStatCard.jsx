function ActivityStatCard({ icon, label, value }) {
    return (
        <article className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-slate-100">
                    {icon}
                </span>
                <div>
                    <p className="text-xs font-bold tracking-wide text-slate-600">{label}</p>
                    <p className="font-['Manrope'] text-2xl font-extrabold text-slate-900">{value}</p>
                </div>
            </div>
        </article>
    )
}

export default ActivityStatCard
