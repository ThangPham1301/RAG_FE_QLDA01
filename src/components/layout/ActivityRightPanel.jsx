import { Search } from 'lucide-react'
import avatarImage from '../../assets/activity/profile-avatar.png'

function ActivityRightPanel() {
    return (
        <aside className="h-fit rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sticky top-6">
            <div className="space-y-4">
                <div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search activity history..."
                            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-8 text-sm placeholder:text-slate-400"
                        />
                        <Search size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                </div>

                <div className="border-t border-slate-200 pt-4">
                    <div className="flex flex-col items-center text-center">
                        <img src={avatarImage} alt="Profile" className="h-16 w-16 rounded-full mb-3" />
                        <p className="font-semibold text-slate-900">Dr. Elena Ross</p>
                        <p className="text-xs font-bold tracking-wide text-slate-600 mt-1">PRINCIPAL RESEARCHER</p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default ActivityRightPanel
