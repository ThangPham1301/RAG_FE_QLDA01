import DocumentMetricItem from '../ui/DocumentMetricItem'

function DocumentMetricsPanel() {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="grid gap-6 md:grid-cols-3">
                <DocumentMetricItem label="WORD COUNT" value="14.2k" />
                <DocumentMetricItem label="READING TIME" value="52m" />
                <div className="text-center">
                    <p className="text-xs font-bold tracking-wide text-slate-600">CONFIDENCE SCORE</p>
                    <p className="mt-2 font-['Manrope'] text-2xl font-extrabold text-slate-900">98.4%</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                        <span className="block h-full w-[98.4%] bg-gradient-to-r from-emerald-500 to-emerald-600" />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default DocumentMetricsPanel
