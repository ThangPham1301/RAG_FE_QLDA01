function AccountFooterActions() {
    return (
        <section className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex flex-wrap gap-5 text-sm font-semibold text-slate-600">
                <button type="button" className="transition hover:text-slate-900">Privacy Policy</button>
                <button type="button" className="transition hover:text-slate-900">Data Export</button>
                <button type="button" className="transition hover:text-slate-900">System Status</button>
            </div>

            <button
                type="button"
                className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-bold tracking-wide text-rose-700"
            >
                DEACTIVATE ACCOUNT
            </button>
        </section>
    )
}

export default AccountFooterActions
