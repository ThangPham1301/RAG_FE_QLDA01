import { KeyRound, MailCheck } from 'lucide-react'
import SecuritySettingRow from '../ui/SecuritySettingRow'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'

function AccountSecurityPanel({ onChangePasswordClick }) {
    const { user } = useAuth()
    const { t } = useAppSettings()
    const emailVerified = !!user?.is_email_verified

    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="font-['Manrope'] text-xl font-extrabold text-slate-900">{t.accountSecurity}</h3>
            <div className="mt-4 space-y-3">
                <SecuritySettingRow
                    icon={<MailCheck size={17} />}
                    title={t.emailVerification}
                    description={emailVerified ? t.emailVerificationDescriptionVerified : t.emailVerificationDescriptionPending}
                    statusLabel={emailVerified ? t.verified : t.pending}
                    statusTone={emailVerified ? 'success' : 'warning'}
                />
                <SecuritySettingRow
                    icon={<KeyRound size={17} />}
                    title={t.changePassword}
                    description={t.changePasswordDescription}
                    actionLabel={t.change}
                    onAction={onChangePasswordClick}
                />
            </div>
        </section>
    )
}

export default AccountSecurityPanel
