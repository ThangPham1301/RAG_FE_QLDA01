import { useAppSettings } from '../../context/AppSettingsContext'

function AccountHeader() {
    const { t } = useAppSettings()

    return (
        <section>
            <h1 className="font-['Manrope'] text-4xl font-extrabold text-slate-900">{t.accountSettings}</h1>
            <p className="mt-2 text-sm text-slate-600">
                {t.accountSettingsDescription}
            </p>
        </section>
    )
}

export default AccountHeader
