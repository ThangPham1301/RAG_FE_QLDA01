function DocumentMetricItem({ label, value }) {
    return (
        <div className="text-center">
            <p className="text-xs font-bold tracking-wide text-slate-600">{label}</p>
            <p className="mt-2 font-['Manrope'] text-2xl font-extrabold text-slate-900">{value}</p>
        </div>
    )
}

export default DocumentMetricItem
