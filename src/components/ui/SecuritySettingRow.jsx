function SecuritySettingRow({
    icon,
    title,
    description,
    actionLabel,
    actionTone = 'neutral',
    toggled = null,
    statusLabel,
    statusTone = 'neutral',
    onAction,
}) {
    const actionClass =
        actionTone === 'danger'
            ? 'text-rose-700 hover:text-rose-600'
            : 'text-blue-800 hover:text-blue-700'
    const statusClass =
        statusTone === 'success'
            ? 'bg-emerald-50 text-emerald-700 ring-emerald-100'
            : statusTone === 'warning'
                ? 'bg-amber-50 text-amber-700 ring-amber-100'
                : 'bg-slate-50 text-slate-600 ring-slate-100'

    return (
        <article className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-white p-4">
            <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-[#e5eeff] text-blue-800">
                    {icon}
                </span>
                <div>
                    <p className="text-sm font-bold text-slate-900">{title}</p>
                    <p className="text-xs text-slate-600">{description}</p>
                </div>
            </div>

            {actionLabel ? (
                <button type="button" onClick={onAction} className={`text-xs font-bold tracking-wide ${actionClass}`}>
                    {actionLabel}
                </button>
            ) : statusLabel ? (
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold ring-1 ${statusClass}`}>
                    {statusLabel}
                </span>
            ) : toggled !== null ? (
                <button
                    type="button"
                    aria-pressed={toggled}
                    className={`relative h-7 w-12 rounded-full transition ${toggled ? 'bg-blue-800' : 'bg-slate-300'
                        }`}
                >
                    <span
                        className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${toggled ? 'left-6' : 'left-1'
                            }`}
                    />
                </button>
            ) : (
                null
            )}
        </article>
    )
}

export default SecuritySettingRow
