import { Clock, Tag, Shield, Eye } from 'lucide-react'
import ActivityItemCard from '../ui/ActivityItemCard'
import ActivityDateGroup from './ActivityDateGroup'

function ActivityFeed() {
    return (
        <section className="rounded-2xl bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <ActivityDateGroup date="TODAY">
                <ActivityItemCard
                    icon={<Clock size={16} />}
                    title="System Synthesis Initiation"
                    time="14:22 PM"
                    description={'Full cross-repository synchronization started for Project "Aether". Validating 1.2k research blocks against semantic standards.'}
                    extraInfo="Synced by Core Team"
                    badges={[{ label: 'AI OPTIMIZED', type: 'info' }]}
                />
                <ActivityItemCard
                    icon={<Tag size={16} />}
                    title="Archive Update: Medical Journals"
                    time="11:05 AM"
                    description="Ingested 42 new clinical trial publications from PeerReview+ API. Automatically categorized under Neurology > Synaptic Mapping."
                    extraInfo="Automated Process: ID_4922"
                    badges={[
                        { label: 'METADATA_GEN', type: 'default' },
                        { label: 'API_PUSH', type: 'default' },
                    ]}
                />
            </ActivityDateGroup>

            <ActivityDateGroup date="YESTERDAY">
                <ActivityItemCard
                    icon={<Shield size={16} />}
                    title="Security Protocol Revision"
                    time="16:45 PM"
                    description="Encryption keys rotated for all collaborative folders. 2-factor authentication enforced for external research contractors."
                    extraInfo="Admin: Marcus Thorne"
                    badges={[{ label: 'SECURITY ALERT', type: 'alert' }]}
                />
                <ActivityItemCard
                    icon={<Eye size={16} />}
                    title="Weekly Synthesis Report Generated"
                    time="09:00 AM"
                    description={'Aggregate analysis of 450 active threads completed. Key insight: "Hyper-parameter variance in Cognitive Model Beta is trending toward 0.05% stability."'}
                    extraInfo="Recipient: Executive Board"
                    badges={[{ label: 'VIEW REPORT', type: 'success' }]}
                />
            </ActivityDateGroup>

            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <p className="text-sm text-slate-600">Showing 4 of 2,492 entries</p>
                <div className="flex gap-2">
                    <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                        ‹
                    </button>
                    {[1, 2, 3, '...', 125].map((num, i) => (
                        <button
                            key={i}
                            className={`grid h-8 w-8 place-items-center rounded-lg text-sm font-semibold ${num === 1
                                    ? 'bg-blue-800 text-white'
                                    : 'border border-slate-200 bg-white hover:bg-slate-50'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                    <button className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white hover:bg-slate-50">
                        ›
                    </button>
                </div>
            </div>
        </section>
    )
}

export default ActivityFeed
