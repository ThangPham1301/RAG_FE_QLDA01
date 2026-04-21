function PreferenceCard({ icon, title, description }) {
    return (
        <article className="rounded-xl border border-slate-100 bg-white p-4">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e5eeff] text-blue-800">{icon}</span>
            <p className="mt-3 text-sm font-bold text-slate-900">{title}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">{description}</p>
        </article>
    )
}

export default PreferenceCard
