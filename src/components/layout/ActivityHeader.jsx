function ActivityHeader() {
    return (
        <section className="space-y-2">
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide text-slate-600">ANALYTICS</span>
                <span className="inline-block h-1 w-1 rounded-full bg-slate-300" />
                <span className="text-xs font-bold tracking-wide text-slate-600">ACTIVITY HISTORY</span>
            </div>
            <h1 className="font-['Manrope'] text-3xl font-extrabold text-slate-900">Synchronized Activity History</h1>
            <p className="text-slate-600">
                Monitor cross-functional research activities, AI processing logs, and team synchronization events in real-time.
            </p>
        </section>
    )
}

export default ActivityHeader
