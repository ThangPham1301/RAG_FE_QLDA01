import ConsentRow from '../ui/ConsentRow'
import FormInputField from '../ui/FormInputField'
import PrimaryButton from '../ui/PrimaryButton'
import RequirementChip from '../ui/RequirementChip'
import { Link } from 'react-router-dom'

function RegisterFormPanel() {
  return (
    <section className="w-full flex-1 px-5 py-8 md:px-10 md:py-12 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[460px]">
        <header className="space-y-2">
          <p className="text-xs font-bold tracking-wide text-blue-800">
            SYSTEM ENTRANCE
          </p>
          <h1 className="font-['Manrope'] text-4xl font-extrabold text-slate-900">
            Create Researcher Account
          </h1>
        </header>

        <div className="mt-8 space-y-6">
          <FormInputField
            label="FULL NAME"
            placeholder="Enter your full name"
            trailingMarker
          />
          <FormInputField
            label="INSTITUTIONAL EMAIL"
            type="email"
            placeholder="name@organization.edu"
            trailingMarker
          />

          <div className="space-y-3">
            <FormInputField
              label="SECURITY PROTOCOL"
              type="password"
              placeholder="••••••••••••"
              trailingMarker
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <RequirementChip label="MIN 8 CHARACTERS" tone="pass" />
              <RequirementChip label="SPECIAL SYMBOL" tone="warning" />
            </div>
          </div>

          <ConsentRow />

          <PrimaryButton
            className="py-4 text-[13px]"
            trailingIcon={<span className="h-4 w-4 rounded-sm bg-white" />}
          >
            INITIALIZE ACCOUNT
          </PrimaryButton>
        </div>

        <footer className="mt-10 space-y-5 text-center">
          <p className="text-sm text-slate-600">
            Already a member of the archive?{' '}
            <Link to="/login" className="font-bold text-blue-800">
              Sign In
            </Link>
          </p>
          <div className="flex justify-center gap-8 text-xs font-bold text-slate-600">
            <button type="button">SUPPORT</button>
            <button type="button">ENGLISH (US)</button>
          </div>
        </footer>
      </div>
    </section>
  )
}

export default RegisterFormPanel