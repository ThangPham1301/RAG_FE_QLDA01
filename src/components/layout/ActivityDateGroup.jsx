function ActivityDateGroup({ date, children }) {
    return (
        <section className="mt-6 first:mt-0">
            <h3 className="text-xs font-bold tracking-wide text-slate-600 uppercase mb-4">{date}</h3>
            <div className="space-y-4">{children}</div>
        </section>
    )
}

export default ActivityDateGroup
