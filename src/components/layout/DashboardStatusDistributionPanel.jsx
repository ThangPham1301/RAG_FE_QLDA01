function DashboardStatusDistributionPanel({ total = 0, indexed = 0, failed = 0, indexing = 0 }) {
    const safeTotal = Math.max(total, 1)
    const pending = Math.max(total - indexed - failed - indexing, 0)
    const items = [
        { label: 'Indexed', value: indexed, tone: 'bg-emerald-500' },
        { label: 'Indexing', value: indexing, tone: 'bg-amber-500' },
        { label: 'Failed', value: failed, tone: 'bg-rose-500' },
        { label: 'Pending', value: pending, tone: 'bg-slate-400' },
    ]

    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Status Distribution</h2>
            <p className="mt-1 text-sm text-slate-600">Phân bổ trạng thái tài liệu theo dữ liệu thống kê hiện tại.</p>

            <div className="mt-5 space-y-3">
                {items.map((item) => {
                    const width = Math.round((item.value / safeTotal) * 100)
                    return (
                        <div key={item.label}>
                            <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                                <span>{item.label}</span>
                                <span>{item.value}</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                <span className={`block h-full ${item.tone}`} style={{ width: `${width}%` }} />
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default DashboardStatusDistributionPanel
