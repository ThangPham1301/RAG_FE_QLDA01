function RequirementChip({ label, tone = 'pass' }) {
  const toneClass =
    tone === 'pass'
      ? 'bg-blue-100 text-slate-600'
      : 'bg-red-100/80 text-red-800'

  const dotClass = tone === 'pass' ? 'bg-slate-900' : 'bg-red-700'

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold ${toneClass}`}>
      <span className={`h-3 w-3 rounded-sm ${dotClass}`} />
      <span>{label}</span>
    </div>
  )
}

export default RequirementChip