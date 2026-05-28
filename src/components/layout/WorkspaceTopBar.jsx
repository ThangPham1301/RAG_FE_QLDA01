import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Languages, LogOut, Moon, SlidersHorizontal, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import defaultAvatar from '../../assets/account/topbar-avatar.png'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'

function WorkspaceTopBar({
    profileName = 'Dr. Aris Thorne',
    avatarSrc,
}) {
    const navigate = useNavigate()
    const { logout, user } = useAuth()
    const { darkMode, language, setDarkMode, setLanguage, t } = useAppSettings()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef(null)

    const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim()
    const displayName = fullName || user?.username || user?.email || profileName
    const displayAvatar = user?.avatar_url || (user ? defaultAvatar : avatarSrc || defaultAvatar)

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setMenuOpen(false)
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
        <header className="flex h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/80 px-6 shadow-[0_8px_24px_rgba(15,23,42,0.04)] backdrop-blur-xl">
            <div />

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-slate-500">
                    <button
                        type="button"
                        className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-slate-300 hover:text-slate-700"
                        aria-label="Notifications"
                    >
                        <Bell size={16} />
                    </button>
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
                        <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.16)]">
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
