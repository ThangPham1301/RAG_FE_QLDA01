function FormInputField({
  label,
  type = 'text',
  placeholder,
  trailingMarker = null,
}) {
  return (
    <label className="block space-y-2">
      <span className="block pl-1 text-xs font-bold tracking-wide text-slate-600">
        {label}
      </span>
      <div className="flex items-center gap-3 rounded-xl bg-[#eff4ff] px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)]">
        <input
          type={type}
          placeholder={placeholder}
          className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
        />
        {trailingMarker ? (
          <span className="h-5 w-5 rounded-sm bg-blue-800/90" aria-hidden="true" />
        ) : null}
      </div>
    </label>
  )
}

export default FormInputField