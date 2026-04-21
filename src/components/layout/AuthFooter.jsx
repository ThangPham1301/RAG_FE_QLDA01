const FOOTER_LINKS = ['PRIVACY POLICY', 'TERMS OF SERVICE', 'SECURITY']

function AuthFooter() {
  return (
    <footer className="flex w-full flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 text-[10px] font-bold tracking-wider text-slate-500 md:flex-row">
      <div className="flex gap-6">
        {FOOTER_LINKS.map((link) => (
          <button key={link} type="button" className="transition hover:text-slate-700">
            {link}
          </button>
        ))}
      </div>
      <p>© 2024 COGNITIVE SLATE INTELLIGENCE</p>
    </footer>
  )
}

export default AuthFooter