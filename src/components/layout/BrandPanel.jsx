function BrandPanel() {
  return (
    <section className="hidden max-w-xl space-y-10 lg:block">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-950 text-white shadow-md">
          <span className="text-lg font-black">R</span>
        </div>
        <h1 className="font-['Manrope'] text-2xl font-extrabold text-slate-900">
          Administrative Document Assistant
        </h1>
      </div>

      <div className="space-y-4">
        <h2 className="font-['Manrope'] text-5xl font-extrabold leading-tight text-slate-900">
          Summarize and ask questions about administrative documents.
        </h2>
        <p className="max-w-md text-lg leading-relaxed text-slate-600">
          Manage official documents, review key information, generate concise
          summaries, and ask questions directly from your document archive.
        </p>
      </div>

      <p className="max-w-md text-sm leading-6 text-slate-600">
        Designed for teams that need faster document review, clearer context,
        and reliable answers from administrative records.
      </p>
    </section>
  )
}

export default BrandPanel
