import { Database, Files, FolderSync, HardDrive } from 'lucide-react'
import DashboardMetricCard from '../ui/DashboardMetricCard'

const METRICS = [
    {
        title: 'TOTAL DOCUMENTS',
        value: '1,284',
        badge: '12%',
        badgeTone: 'emerald',
        icon: <Files size={18} />,
    },
    {
        title: 'ACTIVE CITATIONS',
        value: '4,902',
        badge: 'High Impact',
        badgeTone: 'blue',
        icon: <Database size={18} />,
    },
    {
        title: 'RESEARCH VELOCITY',
        value: '82.5v',
        badge: 'Stable',
        badgeTone: 'blue',
        icon: <FolderSync size={18} />,
    },
    {
        title: 'CLOUD STORAGE',
        value: '12.8TB',
        badge: '64% Full',
        badgeTone: 'amber',
        icon: <HardDrive size={18} />,
    },
]

function DashboardMetricsGrid() {
    return (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {METRICS.map((metric) => (
                <DashboardMetricCard key={metric.title} {...metric} />
            ))}
        </section>
    )
}

export default DashboardMetricsGrid
