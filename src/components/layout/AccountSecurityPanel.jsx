import { KeyRound, MailCheck, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import SecuritySettingRow from '../ui/SecuritySettingRow'
import { useAppSettings } from '../../context/AppSettingsContext'
import { useAuth } from '../../context/AuthContext'
import { toggleTwoFactor } from '../../services/authService'

function AccountSecurityPanel({ onChangePasswordClick }) {
    const { user, updateUser } = useAuth()
    const { t } = useAppSettings()
    const emailVerified = !!user?.is_email_verified
    const twoFactorEnabled = !!user?.is_two_factor_enabled
    const [twoFactorLoading, setTwoFactorLoading] = useState(false)
    const [twoFactorMessage, setTwoFactorMessage] = useState('')
    const [twoFactorError, setTwoFactorError] = useState('')

    const handleToggleTwoFactor = async () => {
        setTwoFactorLoading(true)
        setTwoFactorMessage('')
        setTwoFactorError('')

        try {
            const response = await toggleTwoFactor(!twoFactorEnabled)
            if (response.user) {
                updateUser(response.user)
            }
            setTwoFactorMessage(response.message || 'Two-factor authentication updated.')
        } catch (err) {
            const errorData = err.response?.data || {}
            setTwoFactorError(errorData.detail || err.message || 'Could not update two-factor authentication.')
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
                    title="Two-Factor Authentication"
                    description={twoFactorEnabled ? 'Email OTP is required after password or Google login.' : 'Require an email OTP before entering the app.'}
                    toggled={twoFactorEnabled}
                    onAction={handleToggleTwoFactor}
                    disabled={twoFactorLoading || !emailVerified}
                />
                <SecuritySettingRow
                    icon={<KeyRound size={17} />}
                    title={t.changePassword}
                    description={t.changePasswordDescription}
                    actionLabel={t.change}
                    onAction={onChangePasswordClick}
                />
            </div>
            {twoFactorMessage && (
                <div className="mt-3 rounded-lg bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
                    {twoFactorMessage}
                </div>
            )}
            {twoFactorError && (
                <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs font-medium text-red-700">
                    {twoFactorError}
                </div>
            )}
            {!emailVerified && (
                <div className="mt-3 rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-800">
                    Verify your email before enabling two-factor authentication.
                </div>
            )}
        </section>
    )
}

export default AccountSecurityPanel
