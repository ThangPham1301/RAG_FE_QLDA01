import { Plus } from 'lucide-react'
import visualIndex1 from '../../assets/document/visual-index-1.png'
import visualIndex2 from '../../assets/document/visual-index-2.png'

function VisualIndexPanel() {
    return (
        <section className="rounded-2xl bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between">
                <h3 className="font-['Manrope'] text-lg font-extrabold text-slate-900">Visual Index</h3>
                <button type="button" className="text-xs font-semibold text-blue-800 hover:text-blue-700">
                    View All
                </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="aspect-square rounded-lg bg-slate-100">
                    <img src={visualIndex1} alt="Visual Index 1" className="h-full w-full object-cover rounded-lg" />
                </div>
                <div className="aspect-square rounded-lg bg-slate-100">
                    <img src={visualIndex2} alt="Visual Index 2" className="h-full w-full object-cover rounded-lg" />
                </div>
                <div className="flex items-center justify-center rounded-lg bg-slate-100">
                    <Plus size={20} className="text-slate-400" />
                    <span className="ml-1 text-sm font-bold text-slate-500">+38</span>
                </div>
            </div>
        </section>
    )
}

export default VisualIndexPanel
