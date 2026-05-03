function PrimaryButton({
  children,
  className = '',
  trailingIcon = null,
  onClick = () => {},
  loading = false,
  disabled = false,
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-blue-950 px-4 py-3 text-sm font-bold tracking-wide text-white shadow-[0_8px_20px_rgba(15,23,42,0.25)] transition hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {children}
          {trailingIcon}
        </>
      )}
    </button>
  )
}

export default PrimaryButton