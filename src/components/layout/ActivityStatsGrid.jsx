import { Activity, Database, Lock, BarChart3 } from 'lucide-react'
import ActivityStatCard from '../ui/ActivityStatCard'

function ActivityStatsGrid() {
    return (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            <ActivityStatCard icon={<Activity size={20} />} label="ACTIVE SYNCS" value="1,284" />
            <ActivityStatCard icon={<BarChart3 size={20} />} label="AI COMPUTES" value="42.8k" />
            <ActivityStatCard icon={<Database size={20} />} label="UNIQUE USERS" value="186" />
            <ActivityStatCard icon={<Lock size={20} />} label="INTEGRITY SCORE" value="99.9%" />
        </div>
    )
}

export default ActivityStatsGrid
