import { FileText, Lightbulb, TrendingUp } from 'lucide-react'
import LibraryStatCard from '../ui/LibraryStatCard'

function LibraryStatsGrid() {
    return (
        <section className="grid gap-4 md:grid-cols-3">
            <LibraryStatCard
                icon={<FileText size={20} className="text-blue-800" />}
                value="2,481"
                change="+12%"
                title="TOTAL DOCUMENTS"
            />
            <LibraryStatCard
                icon={<Lightbulb size={20} className="text-blue-800" />}
                value="894"
                title="AI SUMMARIES"
                change="ACTIVE"
            />
            <article className="rounded-2xl bg-white p-5 shadow-[0_8px_32px_rgba(15,23,42,0.04)]">
                <h3 className="font-semibold text-slate-900">KNOWLEDGE COVERAGE</h3>
                <p className="mt-1 text-sm text-slate-600">Semantic Sync Integrity</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <span className="block h-full w-[84%] bg-gradient-to-r from-blue-600 to-blue-800" />
                </div>
                <p className="mt-2 text-xs text-slate-500">84% of database is indexed with deep semantic vectors.</p>
            </article>
        </section>
    )
}

export default LibraryStatsGrid
