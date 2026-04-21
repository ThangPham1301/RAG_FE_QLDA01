import { useState } from 'react'
import { Filter } from 'lucide-react'

function ActivityTabs() {
    const [activeTab, setActiveTab] = useState('Real-time')

    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-4">
                {['Real-time', 'Historical'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-sm font-semibold transition py-2 ${activeTab === tab
                                ? 'border-b-2 border-blue-800 text-blue-800'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:border-slate-400"
            >
                <Filter size={16} />
                Advanced Filters
            </button>
        </div>
    )
}

export default ActivityTabs
