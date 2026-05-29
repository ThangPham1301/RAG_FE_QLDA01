import { KeyRound, MailCheck, ShieldCheck } from 'lucide-react'
import SecuritySettingRow from '../ui/SecuritySettingRow'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'
import { updateTwoFactor } from '../../services/authService'
import { useState } from 'react'

function AccountSecurityPanel({ onChangePasswordClick }) {
    const { user, updateUser } = useAuth()
    const { t } = useAppSettings()
    const [twoFactorLoading, setTwoFactorLoading] = useState(false)
    const [twoFactorError, setTwoFactorError] = useState(null)
    const emailVerified = !!user?.is_email_verified
    const twoFactorEnabled = !!user?.two_factor_enabled

    const handleToggleTwoFactor = async () => {
        setTwoFactorError(null)
        setTwoFactorLoading(true)

        try {
            const updatedUser = await updateTwoFactor(!twoFactorEnabled)
            updateUser(updatedUser)
        } catch (err) {
            const errorData = err.response?.data || {}
            setTwoFactorError(errorData.detail || errorData.error || err.message || 'Unable to update two-factor authentication')
        } finally {
            setTwoFactorLoading(false)
        }
    }

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
                    icon={<ShieldCheck size={17} />}
                    title="Two-factor authentication"
                    description={twoFactorEnabled ? 'Email OTP is required when signing in.' : 'Require an email OTP after password login.'}
                    actionLabel={twoFactorLoading ? 'SAVING...' : twoFactorEnabled ? 'DISABLE' : 'ENABLE'}
                    actionTone={twoFactorEnabled ? 'danger' : 'neutral'}
                    onAction={twoFactorLoading ? undefined : handleToggleTwoFactor}
                />
                {twoFactorError && (
                    <div className="rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">
                        {twoFactorError}
                    </div>
                )}
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
