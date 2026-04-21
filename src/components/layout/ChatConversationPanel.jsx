const SUGGESTIONS = [
  'Compare with EU AI Act',
  'Visualize Model Risks',
  'Summarize p. 45',
]

function ChatConversationPanel() {
  return (
    <section className="flex min-h-0 flex-1 flex-col bg-[#f8f9ff]">
      <div className="flex-1 overflow-y-auto px-10 py-8">
        <div className="mx-auto max-w-[560px] space-y-8">
          <div className="text-center">
            <span className="rounded-full bg-[#eff4ff] px-4 py-1 text-[10px] font-semibold tracking-wide text-slate-500">
              SESSION: QUANTUM ETHICS ANALYSIS
            </span>
          </div>

          <div className="ml-auto max-w-[430px] rounded-xl bg-blue-950 px-6 py-4 text-sm leading-relaxed text-white shadow-sm">
            Can you synthesize the ethical implications of large-scale cognitive
            modeling as discussed in the Neural Frontiers whitepaper?
          </div>

          <div className="space-y-5">
            <div className="max-w-[430px] rounded-xl bg-blue-100 px-6 py-5 text-sm leading-relaxed text-slate-900">
              <p>
                The Neural Frontiers whitepaper outlines three critical ethical
                pivot points. First, the Autonomy Paradox suggests that as models
                become more representative of human thought patterns, the legal
                definition of intellectual agency becomes blurred.
              </p>
              <p className="mt-3">
                Second, it highlights Data Sovereignty Risk related to unconscious
                telemetry. Finally, it proposes a Moral Governor architecture to
                mitigate algorithmic bias before deployment.
              </p>
            </div>

            <div className="space-y-2 text-[10px] font-semibold text-amber-950">
              <span className="inline-flex rounded-full bg-amber-200 px-3 py-1">
                NEURAL_FRONTIERS_V2.PDF · p. 42-45
              </span>
              <br />
              <span className="inline-flex rounded-full bg-amber-200 px-3 py-1">
                ETHICS_REGISTRY_2023 · Section 4
              </span>
            </div>

            <div className="flex gap-2 text-slate-600">
              <button type="button" className="rounded-lg p-2 hover:bg-slate-200">
                <span className="block h-3 w-3 rounded-sm bg-slate-500" />
              </button>
              <button type="button" className="rounded-lg p-2 hover:bg-slate-200">
                <span className="block h-3 w-3 rounded-sm bg-slate-500" />
              </button>
              <button type="button" className="rounded-lg p-2 hover:bg-slate-200">
                <span className="block h-3 w-3 rounded-sm bg-slate-500" />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                className="rounded-full bg-slate-200 px-4 py-2 text-xs font-semibold text-slate-600"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-[#f8f9ff] px-8 py-6">
        <div className="mx-auto flex max-w-[580px] items-center rounded-xl border border-slate-200 bg-white p-2 shadow-sm">
          <button type="button" className="grid h-10 w-10 place-items-center text-slate-500">
            <span className="h-4 w-4 rounded-sm bg-slate-500" />
          </button>
          <input
            type="text"
            placeholder="Ask the archive a specific question..."
            className="flex-1 bg-transparent px-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          />
          <button type="button" className="grid h-10 w-10 place-items-center text-slate-500">
            <span className="h-4 w-4 rounded-sm bg-slate-500" />
          </button>
          <button
            type="button"
            className="ml-2 grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-r from-black to-blue-950"
          >
            <span className="h-3 w-3 rounded-sm bg-white" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default ChatConversationPanel