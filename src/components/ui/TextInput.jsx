function TextInput({
  label,
  type = 'text',
  placeholder,
  helperAction,
  helperText,
}) {
  return (
    <label className="block space-y-2">
      <span className="flex items-center justify-between text-xs font-bold tracking-wide text-slate-600">
        <span>{label}</span>
        {helperAction ? (
          <button
            type="button"
            className="text-[11px] font-semibold text-blue-800 transition hover:text-blue-600"
          >
            {helperAction}
          </button>
        ) : null}
      </span>
      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-[0_1px_0_rgba(148,163,184,0.2)]">
        <input
          type={type}
          placeholder={placeholder}
          defaultValue={helperText}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
    </label>
  )
}

export default TextInput