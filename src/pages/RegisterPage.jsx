import EnterpriseSecurityBadge from '../components/layout/EnterpriseSecurityBadge'
import RegisterFormPanel from '../components/layout/RegisterFormPanel'
import RegisterHeroPanel from '../components/layout/RegisterHeroPanel'

function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-[#e5eeff] p-4 md:p-8 lg:p-14">
      <section className="relative mx-auto flex w-full max-w-[1180px] overflow-hidden rounded-2xl bg-white shadow-[0_32px_64px_rgba(15,23,42,0.08)]">
        <RegisterHeroPanel />
        <RegisterFormPanel />
      </section>

      <p className="pointer-events-none absolute right-8 top-3 text-[120px] font-extrabold leading-none text-slate-900/10">
        CS
      </p>

      <EnterpriseSecurityBadge />
    </main>
  )
}

export default RegisterPage