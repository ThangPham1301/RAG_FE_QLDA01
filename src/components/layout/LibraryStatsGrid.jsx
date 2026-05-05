import { FileText, Lightbulb } from 'lucide-react'
import LibraryStatCard from '../ui/LibraryStatCard'

function LibraryStatsGrid({ stats = {} }) {
    const totalDocuments = stats.totalDocuments ?? 0
    const indexedDocuments = stats.indexedDocuments ?? 0
    const failedDocuments = stats.failedDocuments ?? 0
    const coverage = totalDocuments > 0 ? Math.round((indexedDocuments / totalDocuments) * 100) : 0

    return (
        <section className="grid gap-4 md:grid-cols-3">
            <LibraryStatCard
                icon={<FileText size={20} className="text-blue-800" />}
                value={totalDocuments.toLocaleString()}
                title="TOTAL DOCUMENTS"
            />
            <LibraryStatCard
                icon={<Lightbulb size={20} className="text-blue-800" />}
                value={indexedDocuments.toLocaleString()}
                title="INDEXED DOCUMENTS"
                change={failedDocuments > 0 ? `${failedDocuments} FAILED` : 'HEALTHY'}
            />
            <article className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                <h3 className="font-semibold text-slate-900">KNOWLEDGE COVERAGE</h3>
                <p className="mt-1 text-sm text-slate-600">Semantic Sync Integrity</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <span className="block h-full bg-gradient-to-r from-blue-600 to-blue-800" style={{ width: `${coverage}%` }} />
                </div>
                <p className="mt-2 text-xs text-slate-500">{coverage}% tài liệu đã index và sẵn sàng cho truy vấn ngữ nghĩa.</p>
            </article>
        </section>
    )
}

export default LibraryStatsGrid
