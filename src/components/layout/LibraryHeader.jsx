import { Filter, RefreshCw } from 'lucide-react'

function LibraryHeader() {
    return (
        <section>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold tracking-wide text-blue-800">ENTERPRISE ASSETS</span>
            <h1 className="mt-2 font-['Manrope'] text-4xl font-extrabold text-slate-900">Synchronized Library</h1>
            <p className="mt-2 max-w-2xl text-base text-slate-600">
                Manage, curate, and synchronize your intelligence assets across the secure slate.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
                >
                    <Filter size={16} />
                    Filters
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                    <RefreshCw size={16} />
                    Sync All
                </button>
            </div>
        </section>
    )
}

export default LibraryHeader
