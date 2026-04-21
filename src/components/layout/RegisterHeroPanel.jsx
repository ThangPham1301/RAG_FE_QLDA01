import patternImage from '../../assets/auth/register-pattern.png'

function RegisterHeroPanel() {
  return (
    <section className="relative hidden min-h-[760px] w-full max-w-[420px] overflow-hidden rounded-l-2xl bg-[#cbdbf5] px-12 py-12 lg:block">
      <img
        src={patternImage}
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20"
      />

      <div className="relative z-10 flex h-full flex-col justify-between">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-b from-black to-blue-950 text-white">
              <span className="font-['Manrope'] text-base font-extrabold">S</span>
            </div>
            <p className="font-['Manrope'] text-2xl font-extrabold text-slate-900">
              Cognitive Slate
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="font-['Manrope'] text-5xl font-bold leading-[1.08] text-slate-900">
              Secure your intellectual landscape.
            </h2>
            <p className="max-w-sm text-lg text-slate-700">
              The architectural sanctuary for high-fidelity research and
              synthesis.
            </p>
          </div>
        </div>

        <blockquote className="rounded-xl bg-blue-100/70 p-6">
          <p className="text-sm italic leading-relaxed text-blue-900">
            "The most sophisticated research interface I've used. It feels like
            an extension of my own mind."
          </p>
          <footer className="mt-5 flex items-center gap-3">
            <span className="h-8 w-8 rounded-full border border-white bg-indigo-200" />
            <div>
              <p className="text-xs font-bold text-slate-900">Dr. Elias Vance</p>
              <p className="text-[10px] font-bold tracking-wide text-slate-600">
                PRINCIPAL RESEARCHER
              </p>
            </div>
          </footer>
        </blockquote>
      </div>
    </section>
  )
}

export default RegisterHeroPanel