function ActivityFeedItem({ title, description, timestamp }) {
    return (
        <article className="space-y-1 rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm font-bold text-slate-900">{title}</p>
            <p className="text-xs text-slate-600">{description}</p>
            <p className="text-[11px] font-semibold text-slate-400">{timestamp}</p>
        </article>
    )
}

export default ActivityFeedItem
