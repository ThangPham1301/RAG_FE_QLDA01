function ActivityListItem({ icon, title, description, timestamp }) {
    return (
        <article className="flex items-start gap-3 rounded-xl border border-slate-100 bg-white p-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#e5eeff] text-blue-800">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">{title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
                <p className="mt-2 text-[10px] font-semibold tracking-[0.08em] text-slate-400">{timestamp}</p>
            </div>
        </article>
    )
}

export default ActivityListItem
