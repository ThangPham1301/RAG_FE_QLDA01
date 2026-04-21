function InsightCard({ title, description, buttonLabel, tone = 'blue' }) {
    const toneClass =
        tone === 'emerald'
            ? 'border-emerald-200 bg-emerald-50/60'
            : 'border-blue-200 bg-[#e5eeff]/60'

    return (
        <article className={`rounded-2xl border p-5 ${toneClass}`}>
            <h3 className="font-['Manrope'] text-lg font-extrabold text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{description}</p>
            <button
                type="button"
                className="mt-4 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-bold tracking-wide text-slate-700 transition hover:border-slate-400"
            >
                {buttonLabel}
            </button>
        </article>
    )
}

export default InsightCard
