function ActivityBadge({ type = 'default', label }) {
    const classes = {
        default: 'border-slate-200 bg-slate-50 text-slate-700',
        alert: 'border-red-200 bg-red-50 text-red-700',
        info: 'border-blue-200 bg-blue-50 text-blue-700',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    }

    return (
        <span className={`inline-block rounded-lg border px-2.5 py-1 text-xs font-bold tracking-wide ${classes[type]}`}>
            {label}
        </span>
    )
}

export default ActivityBadge
