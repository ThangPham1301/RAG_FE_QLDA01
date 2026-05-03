import { Fingerprint, KeyRound, ShieldCheck } from 'lucide-react'
import SecuritySettingRow from '../ui/SecuritySettingRow'

function AccountSecurityPanel({ onChangePasswordClick }) {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Security Protocols</h3>
            <div className="mt-4 space-y-3">
                <SecuritySettingRow
                    icon={<ShieldCheck size={17} />}
                    title="Two-Factor Authentication"
                    description="Strong security for your intelligence access."
                    toggled
                />
                <SecuritySettingRow
                    icon={<KeyRound size={17} />}
                    title="Change Password"
                    description="Update your password regularly."
                    actionLabel="CHANGE"
                    onAction={onChangePasswordClick}
                />
                <SecuritySettingRow
                    icon={<Fingerprint size={17} />}
                    title="Active Sessions"
                    description="3 devices currently logged in."
                    actionLabel="REVOKE ALL"
                    actionTone="danger"
                />
            </div>
        </section>
    )
}

export default AccountSecurityPanel
