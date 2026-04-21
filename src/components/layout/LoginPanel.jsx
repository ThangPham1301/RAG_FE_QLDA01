import googleIcon from '../../assets/auth/google.png'
import ssoIcon from '../../assets/auth/sso.png'
import { Link } from 'react-router-dom'
import PrimaryButton from '../ui/PrimaryButton'
import OrDivider from '../ui/OrDivider'
import SocialButton from '../ui/SocialButton'
import TextInput from '../ui/TextInput'

function LoginPanel() {
  return (
    <section className="w-full max-w-md rounded-2xl border border-white/40 bg-white/75 p-10 shadow-[0_28px_64px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="space-y-1">
        <h3 className="font-['Manrope'] text-2xl font-bold text-slate-900">
          Welcome Back
        </h3>
        <p className="text-sm text-slate-600">
          Please enter your credentials to access the Slate.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        <TextInput
          label="EMAIL ADDRESS"
          type="email"
          placeholder="name@organization.com"
        />
        <TextInput
          label="PASSWORD"
          type="password"
          placeholder="••••••••"
          helperAction="Forgot?"
        />
      </div>

      <div className="mt-6 space-y-4">
        <PrimaryButton>SIGN IN TO DASHBOARD</PrimaryButton>
        <Link
          to="/chat"
          className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
        >
          GO TO CHAT (DEMO)
        </Link>
        <OrDivider text="OR CONTINUE WITH" />
        <div className="flex gap-4">
          <SocialButton icon={googleIcon} label="Google" />
          <SocialButton icon={ssoIcon} label="SSO" />
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-slate-600">
        New to Cognitive Slate?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-900 transition hover:text-blue-700"
        >
          Request Access
        </Link>
      </p>
    </section>
  )
}

export default LoginPanel