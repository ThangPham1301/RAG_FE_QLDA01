function DashboardUploadVelocityPanel({ bars = [] }) {
    const fallbackBars = [
        { label: 'N/A', uploads: 0, indexed: 0 },
    ]
    const data = bars.length > 0 ? bars : fallbackBars
    const maxValue = Math.max(...data.map((item) => Math.max(item.uploads, item.indexed)), 1)

    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Upload Velocity</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Số lượng upload và tài liệu đã index trong các ngày gần đây.
                    </p>
                </div>
                <div className="flex gap-4 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />Uploads
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />Indexed
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-7 items-end gap-2">
                {data.map((item) => (
                    <div key={item.label} className="flex flex-col items-center gap-2">
                        <div className="flex h-40 items-end gap-1.5">
                            <div className="w-2.5 rounded-full bg-blue-700" style={{ height: `${Math.round((item.uploads / maxValue) * 100)}%` }} />
                            <div className="w-2.5 rounded-full bg-blue-300" style={{ height: `${Math.round((item.indexed / maxValue) * 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold tracking-wide text-slate-500">{item.label}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default DashboardUploadVelocityPanel
