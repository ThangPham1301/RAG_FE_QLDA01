function AnalysisPipelineStep({ icon, title, description, status = 'completed' }) {
    const statusClasses = {
        completed: 'border-emerald-200 bg-emerald-50',
        processing: 'border-amber-200 bg-amber-50',
        waiting: 'border-slate-200 bg-slate-50',
    }

    const statusBadge = {
        completed: <span className="text-xs font-semibold text-emerald-700">Completed</span>,
        processing: <span className="text-xs font-semibold text-amber-700">In progress</span>,
        waiting: <span className="text-xs font-semibold text-slate-600">Waiting</span>,
    }

    return (
        <article className={`rounded-xl border p-3 ${statusClasses[status] || statusClasses.waiting}`}>
            <div className="flex items-start gap-3">
                <span className={`mt-1 grid h-6 w-6 place-items-center rounded-full ${status === 'completed' ? 'bg-emerald-200 text-emerald-700' : 'bg-slate-300 text-slate-600'}`}>
                    {icon}
                </span>
                <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="mt-0.5 text-xs text-slate-600">{description}</p>
                </div>
            </div>
            {statusBadge[status]}
        </article>
    )
}

export default AnalysisPipelineStep
