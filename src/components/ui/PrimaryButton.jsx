function PrimaryButton({ children, className = '', trailingIcon = null }) {
  return (
    <button
      type="button"
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-black to-blue-950 px-4 py-3 text-sm font-bold tracking-wide text-white shadow-[0_8px_20px_rgba(15,23,42,0.25)] transition hover:scale-[1.01] ${className}`}
    >
      {children}
      {trailingIcon}
    </button>
  )
}

export default PrimaryButton