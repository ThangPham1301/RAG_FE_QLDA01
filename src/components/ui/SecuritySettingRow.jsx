function SecuritySettingRow({ icon, title, description, actionLabel, actionTone = 'neutral', toggled = false, onAction }) {
    const actionClass =
        actionTone === 'danger'
            ? 'text-rose-700 hover:text-rose-600'
            : 'text-blue-800 hover:text-blue-700'

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
            ) : (
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
            )}
        </article>
    )
}

export default SecuritySettingRow
