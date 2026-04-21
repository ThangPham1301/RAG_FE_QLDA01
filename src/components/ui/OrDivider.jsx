function OrDivider({ text }) {
  return (
    <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.16em] text-slate-400">
      <span className="h-px flex-1 bg-slate-200" />
      <span>{text}</span>
      <span className="h-px flex-1 bg-slate-200" />
    </div>
  )
}

export default OrDivider