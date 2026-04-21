function SocialButton({ icon, label }) {
  return (
    <button
      type="button"
      className="flex h-11 flex-1 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
    >
      <img src={icon} alt="" className="h-5 w-5" />
      <span>{label}</span>
    </button>
  )
}

export default SocialButton