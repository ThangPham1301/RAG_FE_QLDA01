import { useState } from 'react'
import pdfPreview from '../../assets/document/pdf-preview.png'
import AIInsightBadge from '../ui/AIInsightBadge'

const TABS = ['Preview', 'Text', 'Chunks', 'Metadata']

function DocumentViewerPanel() {
    const [activeTab, setActiveTab] = useState('Preview')

    return (
        <section className="rounded-2xl bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="border-b border-slate-200">
                <div className="flex items-center gap-6 px-6 py-4">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`text-sm font-semibold transition ${activeTab === tab
                                    ? 'border-b-2 border-blue-800 text-blue-800 pb-2'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-6">
                {activeTab === 'Preview' && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
                            <span className="grid h-10 w-10 place-items-center rounded-lg bg-white font-semibold text-slate-900">
                                PDF
                            </span>
                            <span className="text-sm font-semibold text-slate-700">Page 1 of 42</span>
                        </div>
                        <img src={pdfPreview} alt="PDF Preview" className="w-full rounded-lg" />
                        <AIInsightBadge />
                    </div>
                )}

                {activeTab !== 'Preview' && (
                    <p className="text-center text-sm text-slate-500 py-8">
                        {activeTab} content will be displayed here
                    </p>
                )}
            </div>
        </section>
    )
}

export default DocumentViewerPanel
