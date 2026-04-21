function EnterpriseSecurityBadge() {
  return (
    <aside className="absolute bottom-6 right-6 hidden w-[360px] rounded-2xl border border-white/50 bg-white/80 p-4 shadow-[0_20px_40px_rgba(0,0,0,0.2)] backdrop-blur-xl xl:block">
      <div className="flex items-center gap-4">
        <div className="grid h-12 w-10 place-items-center rounded-lg bg-amber-200">
          <span className="h-5 w-4 rounded-sm bg-amber-950" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-bold text-slate-900">ENTERPRISE SECURITY</p>
          <p className="mt-1 text-[11px] leading-relaxed text-slate-600">
            AES-256 Bit Encryption enabled for all active research slates.
          </p>
        </div>

        <button
          type="button"
          className="grid h-6 w-6 place-items-center rounded-full bg-slate-100"
        >
          <span className="h-2 w-2 rounded-full bg-slate-900" />
        </button>
      </div>
    </aside>
  )
}

export default EnterpriseSecurityBadge