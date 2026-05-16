import { Database, Files, FolderSync, HardDrive } from 'lucide-react'
import DashboardMetricCard from '../ui/DashboardMetricCard'

const DEFAULT_METRICS = [
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

function DashboardMetricsGrid({ metrics = DEFAULT_METRICS, isLoading = false }) {
    if (isLoading) {
        return (
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-28 animate-pulse rounded-2xl bg-slate-100" />
                ))}
            </section>
        )
    }
    return (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric) => (
                <DashboardMetricCard key={metric.title} {...metric} />
            ))}
        </section>
    )
}

export default DashboardMetricsGrid
