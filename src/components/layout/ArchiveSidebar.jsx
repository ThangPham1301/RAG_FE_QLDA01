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
        <aside className="flex w-full max-w-64 flex-col border-r border-slate-800/70 bg-slate-950/95 py-6 text-slate-100 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl">
            <div className="mx-3 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 shadow-[0_12px_30px_rgba(2,6,23,0.18)]">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-linear-to-br from-cyan-400 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
                    <span className="font-['Manrope'] text-sm font-extrabold">S</span>
                </div>
                <div>
                    <p className="font-['Manrope'] text-lg font-bold text-white">Cognitive Slate</p>
                    <p className="text-[10px] font-semibold tracking-[0.28em] text-slate-400">INTELLIGENT ARCHIVE</p>
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
                                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${fallbackActive
                                    ? 'bg-white/10 font-semibold text-white ring-1 ring-white/10 shadow-[0_10px_24px_rgba(15,23,42,0.18)]'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                    }`}
                                aria-current={fallbackActive ? 'page' : undefined}
                                title={label}
                            >
                                <span
                                    className={`grid h-8 w-8 place-items-center rounded-xl ${fallbackActive ? 'bg-linear-to-br from-cyan-400 to-blue-600 text-white' : 'bg-white/10 text-slate-300'
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
                                `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm transition-all duration-200 ${isActive
                                    ? 'bg-white/10 font-semibold text-white ring-1 ring-white/10 shadow-[0_10px_24px_rgba(15,23,42,0.18)]'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`
                            }
                            end={to === '/dashboard'}
                            title={label}
                        >
                            {({ isActive }) => (
                                <>
                                    <span
                                        className={`grid h-8 w-8 place-items-center rounded-xl ${isActive ? 'bg-linear-to-br from-cyan-400 to-blue-600 text-white' : 'bg-white/10 text-slate-300'
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
                    className="w-full rounded-2xl bg-linear-to-r from-slate-950 to-blue-950 py-2.5 text-xs font-semibold tracking-[0.18em] text-white shadow-[0_14px_30px_rgba(15,23,42,0.22)] transition hover:scale-[1.01]"
                >
                    {ctaLabel}
                </button>
            </div>
        </aside>
    )
}

export default ArchiveSidebar
