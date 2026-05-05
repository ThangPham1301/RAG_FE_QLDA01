import { createElement } from 'react'
import { NavLink } from 'react-router-dom'
import {
    BarChart3,
    BookOpen,
    ChartNoAxesCombined,
    LayoutDashboard,
    MessageSquare,
    Settings,
    Users,
} from 'lucide-react'

const NAV_ITEMS = [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Library', icon: BookOpen, to: '/library' },
    { label: 'Chat', icon: MessageSquare, to: '/chat' },
    { label: 'Summarize', icon: ChartNoAxesCombined },
    { label: 'Statistics', icon: BarChart3, to: '/statistics' },
    { label: 'Team', icon: Users },
    { label: 'Settings', icon: Settings, to: '/account' },
]

function ArchiveSidebar({ activeItem = 'Dashboard', ctaLabel = 'NEW RESEARCH' }) {
    return (
        <aside className="flex w-full max-w-64 flex-col bg-[#eff4ff] py-6">
            <div className="flex items-center gap-3 px-6">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-950 text-white">
                    <span className="font-['Manrope'] text-sm font-extrabold">S</span>
                </div>
                <div>
                    <p className="font-['Manrope'] text-lg font-bold text-slate-900">Cognitive Slate</p>
                    <p className="text-[10px] font-semibold tracking-wide text-slate-600">INTELLIGENT ARCHIVE</p>
                </div>
            </div>

            <nav className="mt-6 space-y-1 px-3">
                {NAV_ITEMS.map(({ label, icon: Icon, to }) => {
                    const fallbackActive = label === activeItem

                    if (!to) {
                        return (
                            <button
                                key={label}
                                type="button"
                                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${fallbackActive
                                    ? 'bg-[#e5eeff] font-semibold text-blue-800'
                                    : 'text-slate-700 hover:bg-white/70'
                                    } ${label === 'Dashboard' ? 'border-2 border-slate-900' : 'border-2 border-transparent'}`}
                                aria-current={fallbackActive ? 'page' : undefined}
                                title={label}
                            >
                                <span
                                    className={`grid h-8 w-8 place-items-center rounded-md ${fallbackActive ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'
                                        }`}
                                    aria-hidden="true"
                                >
                                    {createElement(Icon, { size: 16, strokeWidth: 2.2 })}
                                </span>
                                <span className={fallbackActive ? 'font-semibold' : 'font-medium'}>{label}</span>
                            </button>
                        )
                    }

                    return (
                        <NavLink
                            key={label}
                            to={to}
                            className={({ isActive }) =>
                                `flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${isActive
                                    ? 'bg-[#e5eeff] font-semibold text-blue-800'
                                    : 'text-slate-700 hover:bg-white/70'
                                } ${label === 'Dashboard' ? 'border-2 border-slate-900' : 'border-2 border-transparent'}`
                            }
                            end={to === '/dashboard'}
                            title={label}
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`grid h-8 w-8 place-items-center rounded-md ${isActive ? 'bg-blue-800 text-white' : 'bg-slate-500 text-slate-100'
                                            }`}
                                        aria-hidden="true"
                                    >
                                        {createElement(Icon, { size: 16, strokeWidth: 2.2 })}
                                    </span>
                                    <span className={isActive ? 'font-semibold' : 'font-medium'}>{label}</span>
                                </>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            <div className="mt-auto px-6">
                <button
                    type="button"
                    className="w-full rounded-lg bg-gradient-to-r from-black to-blue-950 py-2 text-xs font-semibold tracking-wide text-white shadow-sm"
                >
                    {ctaLabel}
                </button>
            </div>
        </aside>
    )
}

export default ArchiveSidebar
