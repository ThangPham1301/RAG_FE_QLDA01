import { Download } from 'lucide-react'

function DashboardHeader({ onExport = null, isExporting = false }) {
    return (
        <section className="flex flex-wrap items-end justify-between gap-5">
            <div>
                <h1 className="font-['Manrope'] text-4xl font-extrabold text-slate-900">Workspace Overview</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Thong ke tai lieu va hoat dong moi nhat tu he thong.
                </p>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => onExport && onExport('csv')}
                    disabled={!onExport || isExporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                    <Download size={15} />
                    {isExporting ? 'Dang xuat...' : 'Export CSV'}
                </button>
                <button
                    type="button"
                    onClick={() => onExport && onExport('pdf')}
                    disabled={!onExport || isExporting}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
                >
                    <Download size={15} />
                    PDF
                </button>
                <button
                    type="button"
                    onClick={() => onExport && onExport('xls')}
                    disabled={!onExport || isExporting}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm"
                >
                    <Download size={15} />
                    Excel
                </button>
            </div>
        </section>
    )
}

export default DashboardHeader
