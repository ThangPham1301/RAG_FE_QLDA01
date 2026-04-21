import { ChevronRight } from 'lucide-react'
import ActivityBadge from '../ui/ActivityBadge'

function ActivityItemCard({ icon, title, time, description, badges = [], extraInfo }) {
    return (
        <article className="border-b border-slate-200 pb-4 last:border-0">
            <div className="flex gap-4">
                <div className="flex flex-col items-center">
                    <span className="grid h-8 w-8 rounded-full bg-slate-100 place-items-center text-slate-600">
                        {icon}
                    </span>
                    <div className="mt-2 h-12 w-0.5 bg-slate-200" />
                </div>

                <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="font-semibold text-slate-900">{title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{time}</p>
                        </div>
                    </div>
                    <p className="mt-2 text-sm text-slate-600 leading-5">{description}</p>

                    {(badges.length > 0 || extraInfo) && (
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            {badges.map((badge) => (
                                <ActivityBadge key={badge.label} type={badge.type} label={badge.label} />
                            ))}
                            {extraInfo && <span className="text-xs text-slate-600">{extraInfo}</span>}
                        </div>
                    )}
                </div>
            </div>
        </article>
    )
}

export default ActivityItemCard
