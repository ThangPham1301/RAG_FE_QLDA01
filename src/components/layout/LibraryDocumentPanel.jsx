import { Download, MoreVertical } from 'lucide-react'
import DocumentTableRow from '../ui/DocumentTableRow'
import DocumentUploadArea from '../ui/DocumentUploadArea'

const DOCUMENTS = [
    {
        title: 'Q3 Financial Volatility Analysis',
        fileInfo: 'PDF • 12.4 MB',
        category: 'Market Research',
        modified: 'Oct 24, 2023',
        status: 'INDEXED',
    },
    {
        title: 'Nuero-Linguistic Patterns 2024',
        fileInfo: 'DOCX • 2.1 MB',
        category: 'Scientific Study',
        modified: 'Oct 22, 2023',
        status: 'PROCESSING',
    },
    {
        title: 'Dataset: Consumer Sentiment',
        fileInfo: 'XLSX • 45.8 MB',
        category: 'Raw Data',
        modified: 'Oct 19, 2023',
        status: 'SYNCED',
    },
]

function LibraryDocumentPanel() {
    return (
        <section className="space-y-5">
            <DocumentUploadArea />

            <article className="rounded-2xl bg-white shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h2 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Document Archive</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-slate-200 bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">DOCUMENT TITLE</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">CATEGORY</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">LAST MODIFIED</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">STATUS</th>
                                <th className="px-4 py-3 text-left text-xs font-bold tracking-wide text-slate-600">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {DOCUMENTS.map((doc) => (
                                <DocumentTableRow
                                    key={doc.title}
                                    icon={<Download size={16} />}
                                    title={doc.title}
                                    fileInfo={doc.fileInfo}
                                    category={doc.category}
                                    modified={doc.modified}
                                    status={doc.status}
                                    actions={
                                        <>
                                            <button type="button" className="p-2 hover:bg-slate-100">
                                                <MoreVertical size={16} className="text-slate-500" />
                                            </button>
                                        </>
                                    }
                                />
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="border-t border-slate-200 px-6 py-3">
                    <p className="text-xs text-slate-600">Showing 1 to 3 of 2,481 entries</p>
                    <div className="mt-3 flex items-center gap-2">
                        <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Previous</button>
                        {[1, 2, 3].map((page) => (
                            <button key={page} type="button" className={`rounded px-3 py-1 text-xs font-semibold ${page === 1 ? 'bg-blue-800 text-white' : 'border border-slate-300 hover:bg-slate-50'}`}>
                                {page}
                            </button>
                        ))}
                        <button type="button" className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50">Next</button>
                    </div>
                </div>
            </article>
        </section>
    )
}

export default LibraryDocumentPanel
