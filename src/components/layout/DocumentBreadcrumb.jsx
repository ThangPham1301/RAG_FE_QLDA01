import { ChevronRight } from 'lucide-react'

function DocumentBreadcrumb() {
    return (
        <nav className="flex items-center gap-2 text-sm">
            <button type="button" className="text-slate-600 hover:text-slate-900">Library</button>
            <ChevronRight size={14} className="text-slate-400" />
            <button type="button" className="text-slate-600 hover:text-slate-900">Active Research</button>
            <ChevronRight size={14} className="text-slate-400" />
            <span className="text-blue-800 font-semibold">Quantum_Dynamics_Review.pdf</span>
        </nav>
    )
}

export default DocumentBreadcrumb
