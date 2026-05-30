import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import PrimaryButton from '../ui/PrimaryButton'
import TextInput from '../ui/TextInput'
import { useAuth } from '../../context/AuthContext'
import { signUp } from '../../services/authService'
import { validatePassword, getPasswordStrength } from '../../utils/auth'

function PasswordInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  visible,
  onToggle,
  toggleLabel,
}) {
  return (
    <div className="block space-y-2">
      <label className="block text-xs font-bold tracking-wide text-slate-600">
        {label}<span className="text-red-500">*</span>
      </label>
      <div className={`flex items-center rounded-lg border ${error ? 'border-red-300' : 'border-slate-200'} bg-white px-4 py-3 shadow-[0_1px_0_rgba(148,163,184,0.2)]`}>
        <input
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
        <button
          type="button"
          onClick={onToggle}
          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-blue-800"
          aria-label={toggleLabel}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  )
}

function RegisterFormPanel() {
  const navigate = useNavigate()
  const { setError: setAuthError } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [errors, setErrors] = useState({})

  const passwordStrength = getPasswordStrength(password)
  const passwordValid = validatePassword(password).isStrong
  const passwordMatch = password && passwordConfirm && password === passwordConfirm

  const validateForm = () => {
    const newErrors = {}

    if (!firstName.trim()) newErrors.firstName = 'First name is required'
    if (!lastName.trim()) newErrors.lastName = 'Last name is required'
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (!passwordConfirm) newErrors.passwordConfirm = 'Password confirmation is required'

    if (password && !passwordValid) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character'
    }

    if (password && passwordConfirm && !passwordMatch) {
      newErrors.passwordConfirm = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = async (event) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await signUp({
        email,
        firstName,
        lastName,
        password,
        passwordConfirm,
      })

      setSuccess(`Verification email sent to ${email}. Please check your inbox before signing in.`)
      setTimeout(() => {
        navigate('/login')
      }, 1600)
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Sign up failed'
      setError(errorMessage)
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-white/40 bg-white/75 p-10 shadow-[0_28px_64px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <header className="space-y-1">
        <h3 className="font-['Manrope'] text-2xl font-bold text-slate-900">
          Create your workspace account
        </h3>
        <p className="text-sm text-slate-600">
          Join the document workspace to manage archives, summaries, and administrative Q&A.
        </p>
      </header>

      <form onSubmit={handleSignUp} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="FIRST NAME"
            placeholder="John"
            value={firstName}
            onChange={setFirstName}
            error={errors.firstName}
            required
          />
          <TextInput
            label="LAST NAME"
            placeholder="Doe"
            value={lastName}
            onChange={setLastName}
            error={errors.lastName}
            required
          />
        </div>

        <TextInput
          label="EMAIL ADDRESS"
          type="email"
          placeholder="name@organization.com"
          value={email}
          onChange={setEmail}
          error={errors.email}
          required
        />

        <div className="space-y-3">
          <PasswordInput
            label="PASSWORD"
            placeholder="Enter your password"
            value={password}
            onChange={setPassword}
            error={errors.password}
            visible={showPassword}
            onToggle={() => setShowPassword((visible) => !visible)}
            toggleLabel={showPassword ? 'Hide password' : 'Show password'}
          />
          {password && (
            <div className="space-y-2">
              <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full transition-all ${
                    passwordStrength < 50
                      ? 'bg-red-500'
                      : passwordStrength < 75
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${passwordStrength}%` }}
                />
              </div>
              <p className="text-xs text-slate-500">
                Password strength: {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Medium' : 'Strong'}
              </p>
            </div>
          )}
        </div>

        <PasswordInput
          label="CONFIRM PASSWORD"
          placeholder="Confirm your password"
          value={passwordConfirm}
          onChange={setPasswordConfirm}
          error={errors.passwordConfirm}
          visible={showPasswordConfirm}
          onToggle={() => setShowPasswordConfirm((visible) => !visible)}
          toggleLabel={showPasswordConfirm ? 'Hide confirm password' : 'Show confirm password'}
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
            {success}
          </div>
        )}

        <PrimaryButton type="submit" loading={loading}>
          CREATE ACCOUNT
        </PrimaryButton>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-semibold text-blue-900 transition hover:text-blue-700"
        >
          Sign in
        </Link>
      </p>
    </section>
  )
}

export default RegisterFormPanel
