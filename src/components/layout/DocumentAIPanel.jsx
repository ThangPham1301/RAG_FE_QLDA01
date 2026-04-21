import { Send, Zap } from 'lucide-react'

function DocumentAIPanel() {
    const suggestions = ['Summarize pg. 4-12', 'Extract Equations', 'Compare with Archive']

    return (
        <aside className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold tracking-wide text-slate-600">Ask AI about this document...</label>
                    <div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                        <input
                            type="text"
                            placeholder="Ask anything..."
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
                        />
                        <button type="button" className="grid h-8 w-8 place-items-center rounded-lg bg-blue-800 text-white">
                            <Send size={14} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-600">Quick Suggestions</p>
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                        >
                            <Zap size={12} className="mb-1 inline-block mr-1" />
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    )
}

export default DocumentAIPanel
