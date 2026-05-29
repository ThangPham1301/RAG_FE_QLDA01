import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Languages, LogOut, Moon, SlidersHorizontal, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../../assets/account/topbar-avatar.png'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'
import { useRealtime } from '../../context/RealtimeContext'

function WorkspaceTopBar({
    profileName = 'Dr. Aris Thorne',
    avatarSrc,
}) {
    const navigate = useNavigate()
    const { logout, user } = useAuth()
    const { connected, notifications, unreadCount, markNotificationRead } = useRealtime()
    const { darkMode, language, setDarkMode, setLanguage, t } = useAppSettings()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const menuRef = useRef(null)
    const notificationsRef = useRef(null)

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim()
    const displayName = fullName || user?.username || user?.email || profileName
    const displayAvatar = user?.avatar_url || (user ? defaultAvatar : avatarSrc || defaultAvatar)

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setMenuOpen(false)
            }
            if (!notificationsRef.current?.contains(event.target)) {
                setNotificationsOpen(false)
            }
        }

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                setMenuOpen(false)
            }
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const handleLogout = async () => {
        if (isLoggingOut) {
            return
        }

        setIsLoggingOut(true)

        try {
            await logout()
            navigate('/login', { replace: true })
        } finally {
            setIsLoggingOut(false)
        }
    }

    const handleProfileClick = () => {
        setMenuOpen(false)
        navigate('/account')
    }

    return (
        <header className="relative z-[120] flex h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
            <div />

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500">
                    <div ref={notificationsRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setNotificationsOpen((open) => !open)}
                            className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                            aria-label="Notifications"
                            title={connected ? 'Realtime connected' : 'Realtime disconnected'}
                        >
                            <Bell size={16} />
                            {unreadCount > 0 && (
                                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-0 top-[calc(100%+10px)] z-[130] w-96 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                                    <div>
                                        <p className="font-['Manrope'] text-sm font-extrabold text-slate-900">Notifications</p>
                                        <p className="text-xs text-slate-500">{connected ? 'Realtime connected' : 'Reconnecting...'}</p>
                                    </div>
                                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{unreadCount} unread</span>
                                </div>

                                <div className="max-h-96 overflow-y-auto p-2">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-sm text-slate-500">No notifications.</div>
                                    ) : notifications.slice(0, 12).map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => markNotificationRead(item.id)}
                                            className={`mb-1 w-full rounded-xl px-3 py-2.5 text-left transition ${item.is_read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50 hover:bg-blue-100'}`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-slate-900">{item.title}</p>
                                                    <p className="mt-0.5 line-clamp-2 text-xs text-slate-600">{item.message}</p>
                                                </div>
                                                {!item.is_read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-600" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                        aria-label="Preferences"
                    >
                        <SlidersHorizontal size={16} />
                    </button>
                </div>
                <div className="h-8 w-px bg-slate-200" />
                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((open) => !open)}
                        className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-3 py-2 text-left shadow-sm transition hover:border-blue-200 hover:bg-blue-50/60 focus:outline-none focus:ring-2 focus:ring-blue-200"
                        aria-label="Open account menu"
                        aria-expanded={menuOpen}
                    >
                        <img
                            src={displayAvatar}
                            alt={displayName}
                            className="h-10 w-10 rounded-xl object-cover ring-2 ring-slate-100"
                            onError={(event) => {
                                event.currentTarget.onerror = null
                                event.currentTarget.src = defaultAvatar
                            }}
                        />
                        <div className="max-w-[180px] text-right leading-tight">
                            <p className="truncate font-['Manrope'] text-sm font-bold text-slate-900" title={displayName}>{displayName}</p>
                        </div>
                        <ChevronDown size={16} className={`text-slate-500 transition ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-[calc(100%+10px)] z-[130] w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
                            <button
                                type="button"
                                onClick={handleProfileClick}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                <UserRound size={17} className="text-blue-800" />
                                {t.profile}
                            </button>

                            <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700">
                                <Languages size={17} className="text-blue-800" />
                                <span className="flex-1">{t.language}</span>
                                <select
                                    value={language}
                                    onChange={(event) => setLanguage(event.target.value)}
                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-700 outline-none"
                                    aria-label="Select language"
                                >
                                    <option value="en">English</option>
                                    <option value="vi">Tiếng Việt</option>
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={() => setDarkMode((enabled) => !enabled)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-950"
                                aria-pressed={darkMode}
                            >
                                <Moon size={17} className="text-blue-800" />
                                <span className="flex-1">{t.darkMode}</span>
                                <span className={`relative h-6 w-11 rounded-full transition ${darkMode ? 'bg-blue-800' : 'bg-slate-300'}`}>
                                    <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${darkMode ? 'left-6' : 'left-1'}`} />
                                </span>
                            </button>

                            <div className="my-2 h-px bg-slate-100" />

                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <LogOut size={17} />
                                {isLoggingOut ? t.loggingOut : t.logout}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}

export default WorkspaceTopBar
