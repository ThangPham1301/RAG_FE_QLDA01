const BAR_DATA = [
    { month: 'JAN', primary: 42, secondary: 30 },
    { month: 'FEB', primary: 56, secondary: 38 },
    { month: 'MAR', primary: 64, secondary: 49 },
    { month: 'APR', primary: 94, secondary: 72 },
    { month: 'MAY', primary: 58, secondary: 44 },
    { month: 'JUN', primary: 62, secondary: 51 },
    { month: 'JUL', primary: 48, secondary: 35 },
    { month: 'AUG', primary: 54, secondary: 41 },
    { month: 'SEP', primary: 68, secondary: 50 },
    { month: 'OCT', primary: 63, secondary: 52 },
    { month: 'NOV', primary: 72, secondary: 58 },
    { month: 'DEC', primary: 66, secondary: 47 },
]

function DashboardUploadVelocityPanel() {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Upload Velocity</h2>
                    <p className="mt-1 text-sm text-slate-600">
                        Monthly document indexing volume across all teams
                    </p>
                </div>
                <div className="flex gap-4 text-xs font-semibold text-slate-600">
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />Primary Archive
                    </span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-blue-300" />Team Shared
                    </span>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-12 items-end gap-2">
                {BAR_DATA.map((item) => (
                    <div key={item.month} className="flex flex-col items-center gap-2">
                        <div className="flex h-40 items-end gap-1.5">
                            <div className="w-2.5 rounded-full bg-blue-700" style={{ height: `${item.primary}%` }} />
                            <div className="w-2.5 rounded-full bg-blue-300" style={{ height: `${item.secondary}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold tracking-wide text-slate-500">{item.month}</span>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default DashboardUploadVelocityPanel
