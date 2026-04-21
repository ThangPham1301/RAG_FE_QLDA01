import { Download, Share2 } from 'lucide-react'

function DocumentHeader() {
    return (
        <section className="flex items-end justify-between gap-4">
            <h1 className="font-['Manrope'] text-3xl font-extrabold text-slate-900">Quantum Dynamics Review</h1>
            <div className="flex gap-2">
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400"
                >
                    <Share2 size={16} />
                    Share
                </button>
                <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-900"
                >
                    <Download size={16} />
                    Export
                </button>
            </div>
        </section>
    )
}

export default DocumentHeader
