import sourcePdf from '../../assets/chat/source-pdf.png'
import sourceDb from '../../assets/chat/source-db.png'
import sourceInternal from '../../assets/chat/source-internal.png'

function SourceContextPanel() {
  return (
    <aside className="hidden w-[380px] border-l border-slate-200 bg-[#eff4ff] xl:block">
      <div className="flex items-center justify-between px-6 py-6">
        <h2 className="font-['Manrope'] text-sm font-bold text-slate-900">
          SOURCE CONTEXT
        </h2>
        <button type="button" className="h-4 w-4 rounded-sm bg-slate-500" />
      </div>

      <div className="space-y-6 px-6 pb-6">
        <article>
          <div className="relative overflow-hidden rounded-lg bg-blue-100">
            <img src={sourcePdf} alt="Neural Frontiers source" className="w-full" />
            <span className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-[10px] font-semibold text-white">
              PDF
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-900">
            Neural Frontiers: Policy & Ethics 2024
          </p>
          <p className="mt-1 text-[10px] text-slate-600">
            Stanford AI Research Institute • 84 Pages
          </p>
        </article>

        <article>
          <div className="relative overflow-hidden rounded-lg bg-blue-100">
            <img src={sourceDb} alt="GAIER source" className="w-full" />
            <span className="absolute right-2 top-2 rounded bg-black/80 px-2 py-1 text-[10px] font-semibold text-white">
              DB
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-slate-900">
            Global AI Ethics Registry (GAIER)
          </p>
          <p className="mt-1 text-[10px] text-slate-600">
            Live Database Connection • Verified
          </p>
        </article>

        <article className="rounded-lg bg-white p-1 shadow-sm">
          <div className="relative overflow-hidden rounded-lg bg-[#e5eeff]">
            <img src={sourceInternal} alt="Internal archive source" className="w-full" />
            <div className="absolute inset-0 bg-blue-950/20" />
          </div>
          <p className="mt-3 px-2 text-xs font-semibold text-slate-900">
            Cognitive Rights Framework
          </p>
          <p className="mt-1 px-2 pb-2 text-[10px] text-slate-600">
            Internal Archive Document • Restricted
          </p>
        </article>
      </div>
    </aside>
  )
}

export default SourceContextPanel