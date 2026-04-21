import avatar1 from '../../assets/auth/avatar-1.png'
import avatar2 from '../../assets/auth/avatar-2.png'
import avatar3 from '../../assets/auth/avatar-3.png'

function BrandPanel() {
  return (
    <section className="hidden max-w-xl space-y-10 lg:block">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-950 text-white shadow-md">
          <span className="text-lg font-black">S</span>
        </div>
        <h1 className="font-['Manrope'] text-2xl font-extrabold text-slate-900">
          Cognitive Slate
        </h1>
      </div>

      <div className="space-y-4">
        <h2 className="font-['Manrope'] text-5xl font-extrabold leading-tight text-slate-900">
          The Sanctuary for Intelligent Research.
        </h2>
        <p className="max-w-md text-lg leading-relaxed text-slate-600">
          Access your secure archive of synthesized knowledge. Leverage
          enterprise-grade AI to navigate complex datasets with architectural
          clarity.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <img
            src={avatar1}
            alt=""
            className="h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <img
            src={avatar2}
            alt=""
            className="-ml-3 h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <img
            src={avatar3}
            alt=""
            className="-ml-3 h-10 w-10 rounded-full border-2 border-white object-cover"
          />
          <span className="-ml-3 grid h-10 w-10 place-items-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-800">
            +12k
          </span>
        </div>
        <p className="text-sm text-slate-600">
          Trusted by leading research institutions worldwide.
        </p>
      </div>
    </section>
  )
}

export default BrandPanel