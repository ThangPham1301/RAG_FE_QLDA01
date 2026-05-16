import { Download } from 'lucide-react'

function DashboardHeader({ onExport = null, isExporting = false }) {
    return (
        <section className="flex flex-wrap items-end justify-between gap-5">
            <div>
                <h1 className="font-['Manrope'] text-4xl font-extrabold text-slate-900">Workspace Overview</h1>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                    Thống kê tài liệu và hoạt động mới nhất từ hệ thống.
                </p>
            </div>

            <div className="flex flex-wrap">
                <button
                    type="button"
                    onClick={onExport}
                    disabled={!onExport || isExporting}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                    <Download size={15} />
                    {isExporting ? 'Đang xuất...' : 'Export Report'}
                </button>
            </div>
        </section>
    )
}

export default DashboardHeader
