import AuthFooter from '../components/layout/AuthFooter'
import BrandPanel from '../components/layout/BrandPanel'
import LoginPanel from '../components/layout/LoginPanel'

function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f3f8ff] px-5 py-12 font-['Inter'] md:px-8 lg:px-12">
      <div className="pointer-events-none absolute -left-20 top-16 h-64 w-64 rounded-full bg-blue-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-slate-300/45 blur-3xl" />

      <div className="relative mx-auto flex min-h-[78vh] w-full max-w-7xl items-center justify-between gap-10 rounded-3xl border border-white/50 bg-white/40 p-6 backdrop-blur-sm lg:p-10">
        <BrandPanel />
        <LoginPanel />
      </div>

      <div className="relative mx-auto mt-6 w-full max-w-7xl">
        <AuthFooter />
      </div>
    </main>
  )
}

export default AuthPage