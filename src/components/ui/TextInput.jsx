import { useId } from 'react'

function TextInput({
  label,
  type = 'text',
  placeholder,
  helperAction,
  helperText,
  value = '',
  onChange = () => {},
  error = null,
  required = false,
}) {
  const inputId = useId()

  return (
    <div className="block space-y-2">
      <div className="flex items-center justify-between text-xs font-bold tracking-wide text-slate-600">
        <label htmlFor={inputId}>
          {label}{required && <span className="text-red-500">*</span>}
        </label>
        {helperAction && typeof helperAction === 'object' ? (
          <button
            type="button"
            className="inline-flex shrink-0 items-center text-[11px] font-semibold text-blue-800 transition hover:text-blue-600"
            onClick={helperAction.onClick}
          >
            {helperAction.label}
          </button>
        ) : helperAction ? (
          <button
            type="button"
            className="inline-flex shrink-0 items-center text-[11px] font-semibold text-blue-800 transition hover:text-blue-600"
          >
            {helperAction}
          </button>
        ) : null}
      </div>
      <div className={`rounded-lg border ${error ? 'border-red-300' : 'border-slate-200'} bg-white px-4 py-3 shadow-[0_1px_0_rgba(148,163,184,0.2)]`}>
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-xs text-slate-500">{helperText}</p>
      )}
    </div>
  )
}

export default TextInput
