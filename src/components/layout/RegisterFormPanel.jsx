import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import PrimaryButton from '../ui/PrimaryButton'
import FormInputField from '../ui/FormInputField'
import { useAuth } from '../../context/AuthContext'
import { signUp } from '../../services/authService'
import { validatePassword, getPasswordStrength } from '../../utils/auth'

function RegisterFormPanel() {
  const navigate = useNavigate()
  const { login: authLogin, setError: setAuthError } = useAuth()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
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

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      const response = await signUp({
        email,
        firstName,
        lastName,
        password,
        passwordConfirm,
      })

      // Show verification message
      setError(null)
      alert(`Verification email sent to ${email}. Please check your inbox.`)
      navigate('/login')
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message || 'Sign up failed'
      setError(errorMessage)
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

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

        <form onSubmit={handleSignUp} className="mt-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormInputField
              label="FIRST NAME"
              placeholder="John"
              value={firstName}
              onChange={setFirstName}
              error={errors.firstName}
              trailingMarker={!!firstName}
            />
            <FormInputField
              label="LAST NAME"
              placeholder="Doe"
              value={lastName}
              onChange={setLastName}
              error={errors.lastName}
              trailingMarker={!!lastName}
            />
          </div>

          <FormInputField
            label="INSTITUTIONAL EMAIL"
            type="email"
            placeholder="name@organization.edu"
            value={email}
            onChange={setEmail}
            error={errors.email}
            trailingMarker={!!email}
          />

          <div className="space-y-3">
            <FormInputField
              label="SECURITY PROTOCOL"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={setPassword}
              error={errors.password}
              trailingMarker={passwordValid}
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

          <FormInputField
            label="CONFIRM PASSWORD"
            type="password"
            placeholder="••••••••••••"
            value={passwordConfirm}
            onChange={setPasswordConfirm}
            error={errors.passwordConfirm}
            trailingMarker={passwordMatch}
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <PrimaryButton
            type="submit"
            loading={loading}
            className="py-4 text-[13px]"
          >
            INITIALIZE ACCOUNT
          </PrimaryButton>
        </form>

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