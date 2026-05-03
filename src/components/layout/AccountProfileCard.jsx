import { BadgeCheck, Mail, Pencil, Timer } from 'lucide-react'
import profileAvatar from '../../assets/account/profile-avatar.png'
import { useAuth } from '../../context/AuthContext'

function AccountProfileCard({ onEditProfileClick, onEditAvatarClick }) {
  const { user } = useAuth()
    return (
        <section className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="pointer-events-none absolute -right-10 top-20 h-56 w-56 rounded-full bg-blue-100/60" />

            <div className="relative flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <img
                            src={user?.avatar_url || profileAvatar}
                            alt={user?.first_name || 'User'}
                            className="h-28 w-28 rounded-2xl object-cover"
                        />
                        <button
                            type="button"
                            onClick={onEditAvatarClick}
                            className="absolute -bottom-2 -right-2 grid h-7 w-7 place-items-center rounded-full border border-blue-200 bg-white text-blue-800"
                            aria-label="Edit avatar"
                        >
                            <Pencil size={13} />
                        </button>
                    </div>

                    <div>
                        <h2 className="font-['Manrope'] text-2xl font-extrabold text-slate-900">
                            {user?.first_name || 'User'} {user?.last_name || ''}
                        </h2>
                        <p className="mt-1 max-w-md text-sm text-slate-600">
                            {user?.bio || 'User profile'}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold tracking-wide">
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-900">PRO RESEARCHER</span>
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-800">ARCHIVE ADMIN</span>
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onEditProfileClick}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e5eeff] px-4 py-2 text-xs font-bold tracking-wide text-blue-900"
                >
                    <Pencil size={14} />
                    Edit Profile
                </button>
            </div>

            <div className="relative mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500">EMAIL ADDRESS</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Mail size={14} />
                        {user?.email || 'email@example.com'}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500">TIMEZONE</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Timer size={14} />
                        EST (UTC-5) - New York
                    </p>
                </div>
            </div>

            <article className="relative mt-5 rounded-xl border border-blue-100 bg-[#e5eeff]/70 p-4">
                <p className="text-sm font-bold text-blue-950">Archive Capacity</p>
                <p className="mt-1 text-xs text-slate-700">You've used 82% of your research storage.</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white">
                    <span className="block h-full w-[82%] rounded-full bg-gradient-to-r from-blue-700 to-blue-500" />
                </div>
                <button
                    type="button"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg bg-blue-900 px-3 py-2 text-[11px] font-bold tracking-wide text-white"
                >
                    <BadgeCheck size={13} />
                    UPGRADE PLAN
                </button>
            </article>
        </section>
    )
}

export default AccountProfileCard
