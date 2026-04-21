import { Upload } from 'lucide-react'

function DocumentUploadArea() {
    return (
        <section className="rounded-2xl border-2 border-dashed border-blue-200 bg-[#e5eeff]/30 p-8 text-center">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-white">
                <Upload size={20} className="text-blue-800" />
            </div>
            <h3 className="mt-3 text-lg font-bold text-slate-900">Ingest New Research</h3>
            <p className="mt-1 text-sm text-slate-600">Drag and drop PDFs, DOCX, or Excel files here</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <button
                    type="button"
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                    Browse Files
                </button>
                <button
                    type="button"
                    className="rounded-lg border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400"
                >
                    Import URL
                </button>
            </div>
        </section>
    )
}

export default DocumentUploadArea
