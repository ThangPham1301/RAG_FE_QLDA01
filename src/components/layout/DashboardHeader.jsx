import { CalendarRange, Download } from 'lucide-react'

function DashboardHeader() {
    return (
        <section className="flex flex-wrap items-end justify-between gap-5">
            <div>
                <h1 className="font-['Manrope'] text-4xl font-extrabold text-slate-900">Workspace Overview</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Synchronized insights from your intelligent document archive. Last updated 12 minutes ago.
                </p>
            </div>

            <div className="flex flex-wrap gap-3">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm"
                >
                    <CalendarRange size={15} />
                    Last 30 Days
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                    <Download size={15} />
                    Export Report
                </button>
            </div>
        </section>
    )
}

export default DashboardHeader
