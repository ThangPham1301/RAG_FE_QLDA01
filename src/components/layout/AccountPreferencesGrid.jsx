import { BellRing, Globe, Palette } from 'lucide-react'
import PreferenceCard from '../ui/PreferenceCard'

function AccountPreferencesGrid() {
    return (
        <section className="grid gap-3 md:grid-cols-3">
            <PreferenceCard
                icon={<Globe size={17} />}
                title="Language and Region"
                description="English (US), Metric units."
            />
            <PreferenceCard
                icon={<BellRing size={17} />}
                title="Notification Matrix"
                description="Smart digests, critical alerts only."
            />
            <PreferenceCard
                icon={<Palette size={17} />}
                title="Interface Aesthetics"
                description="Light mode, compact density."
            />
        </section>
    )
}

export default AccountPreferencesGrid
