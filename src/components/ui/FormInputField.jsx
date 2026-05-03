function FormInputField({
  label,
  type = 'text',
  placeholder,
  trailingMarker = null,
  value = '',
  onChange = () => {},
  error = null,
  required = false,
  disabled = false,
}) {
  return (
    <label className="block space-y-2">
      <span className="block pl-1 text-xs font-bold tracking-wide text-slate-600">
        {label}{required && <span className="text-red-500">*</span>}
      </span>
      <div className={`flex items-center gap-3 rounded-xl ${error ? 'bg-red-50' : 'bg-[#eff4ff]'} px-6 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.06)] border ${error ? 'border-red-300' : 'border-transparent'}`}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 disabled:opacity-50"
        />
        {trailingMarker && !error ? (
          <span className="h-5 w-5 rounded-sm bg-blue-800/90" aria-hidden="true" />
        ) : error ? (
          <span className="h-5 w-5 rounded-sm bg-red-400" aria-hidden="true" />
        ) : null}
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </label>
  )
}

export default FormInputField