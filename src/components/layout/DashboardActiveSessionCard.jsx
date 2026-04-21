import { ArrowRight, CircleCheck } from 'lucide-react'
import avatar01 from '../../assets/dashboard/avatar-01.png'
import avatar02 from '../../assets/dashboard/avatar-02.png'
import avatar03 from '../../assets/dashboard/avatar-03.png'

function DashboardActiveSessionCard() {
    return (
        <section className="rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#102753] to-[#1d4ed8] p-6 text-white shadow-[0_16px_40px_rgba(15,23,42,0.24)]">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold tracking-[0.1em]">
                <CircleCheck size={12} />
                ACTIVE LAB SESSION
            </span>

            <h3 className="mt-4 max-w-md font-['Manrope'] text-2xl font-extrabold">
                Quantum Computing and Cognitive Modeling
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
                Synchronizing 42 core documents with the latest experimental findings from CERN.
                High confidence link established.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                    {[avatar01, avatar02, avatar03].map((avatar, index) => (
                        <img
                            key={avatar}
                            src={avatar}
                            alt={`Team member ${index + 1}`}
                            className="-mr-3 h-9 w-9 rounded-full border-2 border-blue-900/70 object-cover"
                        />
                    ))}
                    <span className="ml-4 rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold">+8</span>
                </div>

                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-blue-900"
                >
                    Enter Workspace
                    <ArrowRight size={14} />
                </button>
            </div>
        </section>
    )
}

export default DashboardActiveSessionCard
