import { CheckCircle, Clock, Loader } from 'lucide-react'
import AnalysisPipelineStep from '../ui/AnalysisPipelineStep'

function AnalysisPipelinePanel() {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <h3 className="font-['Manrope'] text-xl font-extrabold text-slate-900">Analysis Pipeline</h3>

            <div className="mt-4 space-y-3">
                <AnalysisPipelineStep
                    icon={<CheckCircle size={16} />}
                    title="OCR Text Extraction"
                    description="Completed • 2.4k segments"
                    status="completed"
                />
                <AnalysisPipelineStep
                    icon={<CheckCircle size={16} />}
                    title="Semantic Chunking"
                    description="Completed • 18 themes"
                    status="completed"
                />
                <AnalysisPipelineStep
                    icon={<Loader size={16} />}
                    title="Entity Linking"
                    description="In progress... (82%)"
                    status="processing"
                />
                <AnalysisPipelineStep
                    icon={<Clock size={16} />}
                    title="Graph Generation"
                    description="Waiting..."
                    status="waiting"
                />
            </div>
        </section>
    )
}

export default AnalysisPipelinePanel
