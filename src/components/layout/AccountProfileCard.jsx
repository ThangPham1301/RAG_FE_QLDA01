import { CircleCheck, Mail, Pencil } from 'lucide-react'
import profileAvatar from '../../assets/account/topbar-avatar.png'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'

function AccountProfileCard({ onEditProfileClick, onEditAvatarClick }) {
  const { user } = useAuth()
  const { t } = useAppSettings()
    return (
        <section className="rounded-2xl bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
            <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <img
                            src={user?.avatar_url || profileAvatar}
                            alt={user?.first_name || 'User'}
                            className="h-28 w-28 rounded-2xl object-cover"
                            onError={(event) => {
                                event.currentTarget.onerror = null
                                event.currentTarget.src = profileAvatar
                            }}
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
                            {user?.bio || t.userProfile}
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onEditProfileClick}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#e5eeff] px-4 py-2 text-xs font-bold tracking-wide text-blue-900"
                >
                    <Pencil size={14} />
                    {t.profile}
                </button>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500">{t.emailAddress}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <Mail size={14} />
                        {user?.email || 'email@example.com'}
                    </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold tracking-[0.12em] text-slate-500">{t.accountStatus}</p>
                    <p className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                        <CircleCheck size={14} className="text-emerald-600" />
                        {t.accountActive}
                    </p>
                </div>
            </div>
        </section>
    )
}

export default AccountProfileCard
