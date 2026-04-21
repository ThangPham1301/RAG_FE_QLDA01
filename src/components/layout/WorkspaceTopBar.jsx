import { Bell, Search, SlidersHorizontal } from 'lucide-react'

function WorkspaceTopBar({
    placeholder = 'Search archive...',
    profileName = 'Dr. Aris Thorne',
    profileRole = 'Lead Researcher',
    avatarSrc,
}) {
    return (
        <header className="flex h-[76px] items-center justify-between border-b border-slate-200 bg-[#f8f9ff]/80 px-6 backdrop-blur-md">
            <div className="flex h-12 w-full max-w-sm items-center gap-3 rounded-full bg-[#eff4ff] px-4">
                <Search size={16} className="text-slate-500" />
                <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-500"
                />
            </div>

            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2 text-slate-500">
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white transition hover:border-slate-300 hover:text-slate-700"
                        aria-label="Notifications"
                    >
                        <Bell size={16} />
                    </button>
                    <button
                        type="button"
                        className="grid h-9 w-9 place-items-center rounded-lg border border-slate-200 bg-white transition hover:border-slate-300 hover:text-slate-700"
                        aria-label="Preferences"
                    >
                        <SlidersHorizontal size={16} />
                    </button>
                </div>
                <div className="h-8 w-px bg-slate-300" />
                <div className="flex items-center gap-3">
                    <img src={avatarSrc} alt={profileName} className="h-10 w-10 rounded-full object-cover" />
                    <div className="text-right leading-tight">
                        <p className="font-['Manrope'] text-sm font-bold text-slate-900">{profileName}</p>
                        <p className="text-[11px] font-semibold text-slate-500">{profileRole}</p>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default WorkspaceTopBar
