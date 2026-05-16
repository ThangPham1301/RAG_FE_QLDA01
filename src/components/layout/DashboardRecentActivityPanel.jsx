import ActivityListItem from '../ui/ActivityListItem'

function DashboardRecentActivityPanel({ activities = [], isLoading = false }) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
                <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Recent Activity</h2>
                <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
            </div>

            <div className="mt-4 space-y-3">
                {isLoading && (
                    <p className="text-sm text-slate-500">Đang tải hoạt động...</p>
                )}
                {!isLoading && activities.length === 0 && (
                    <p className="text-sm text-slate-500">Chưa có hoạt động gần đây.</p>
                )}
                {!isLoading && activities.map((item, index) => (
                    <ActivityListItem key={item.id || `${item.title}-${index}`} {...item} />
                ))}
            </div>
        </section>
    )
}

export default DashboardRecentActivityPanel
