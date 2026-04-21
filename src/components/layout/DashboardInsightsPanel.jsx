import InsightCard from '../ui/InsightCard'

function DashboardInsightsPanel() {
    return (
        <section className="grid gap-4 lg:grid-cols-2">
            <InsightCard
                title="AI Insights"
                description="3 document clusters found with potentially conflicting methodology data."
                buttonLabel="Review Conflicts"
            />
            <InsightCard
                title="Library Health"
                description="Meta-tagging accuracy is at 98.4%. Your archive is perfectly organized."
                buttonLabel="Full Audit"
                tone="emerald"
            />
        </section>
    )
}

export default DashboardInsightsPanel
