import { Link, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import PrimaryButton from '../ui/PrimaryButton'
import TextInput from '../ui/TextInput'
import { useAuth } from '../../context/AuthContext'
import { isAdminUser } from '../ProtectedRoute'
import { googleLogin, login, requestOTP, verifyOTP } from '../../services/authService'

function LoginPanel() {
  const navigate = useNavigate()
  const { login: authLogin, setError: setAuthError } = useAuth()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [pendingEmail, setPendingEmail] = useState('')
  const [otpStep, setOtpStep] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const googleButtonRef = useRef(null)
  const googleConfigured = Boolean(googleClientId && !googleClientId.startsWith('your-'))

  const finishLogin = useCallback((response) => {
    authLogin(response.user, response.tokens)
    navigate(isAdminUser(response.user) ? '/dashboard' : '/library', { replace: true })
  }, [authLogin, navigate])

  const beginOtpStep = useCallback((response) => {
    setPendingEmail(response.email || email)
    setEmail(response.email || email)
    setOtp('')
    setOtpStep(true)
    setError(null)
  }, [email])

  useEffect(() => {
    if (!googleConfigured) {
      return undefined
    }

    let cancelled = false

    const handleGoogleCredential = async (credentialResponse) => {
      if (!credentialResponse?.credential) {
        setError('Google did not return a login token. Please try again.')
        return
      }

      setGoogleLoading(true)
      setError(null)

      try {
        const response = await googleLogin(credentialResponse.credential)
        if (response.requires_2fa) {
          beginOtpStep(response)
          return
        }
        finishLogin(response)
      } catch (err) {
        const errorData = err.response?.data || {}
        const errorMessage = errorData.detail || errorData.error || err.message || 'Google login failed'
        setError(errorMessage)
        setAuthError(errorMessage)
      } finally {
        setGoogleLoading(false)
      }
    }

    const initializeGoogle = () => {
      if (cancelled || !window.google?.accounts?.id || !googleButtonRef.current) {
        return
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      })

      googleButtonRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'rectangular',
        text: 'continue_with',
        width: 320,
        locale: 'en',
      })
    }

    if (window.google?.accounts?.id) {
      initializeGoogle()
      return () => {
        cancelled = true
      }
    }

    const existingScript = document.querySelector('script[src^="https://accounts.google.com/gsi/client"]')
    if (existingScript) {
      existingScript.addEventListener('load', initializeGoogle)
      return () => {
        cancelled = true
        existingScript.removeEventListener('load', initializeGoogle)
      }
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client?hl=en'
    script.async = true
    script.defer = true
    script.onload = initializeGoogle
    document.head.appendChild(script)

    return () => {
      cancelled = true
      script.onload = null
    }
  }, [beginOtpStep, finishLogin, googleClientId, googleConfigured, setAuthError])

  const handleLogin = async (event) => {
    event.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      const response = await login(email, password)
      if (response.requires_2fa) {
        beginOtpStep(response)
        return
      }
      finishLogin(response)
    } catch (err) {
      const errorData = err.response?.data || {}
      let errorMessage = errorData.detail || errorData.error || err.message || 'Login failed'

      if (errorData.code === 'email_not_verified') {
        errorMessage = 'Tai khoan chua xac thuc email. He thong da gui lai email xac thuc, vui long kiem tra hop thu.'
      }

      setError(errorMessage)
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()
    setError(null)

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP sent to your email')
      return
    }

    setLoading(true)

    try {
      const response = await verifyOTP(pendingEmail || email, otp, 'login_2fa')
      finishLogin(response)
    } catch (err) {
      const errorData = err.response?.data || {}
      const errorMessage = errorData.detail || errorData.error || err.message || 'Invalid or expired OTP'
      setError(errorMessage)
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setError(null)
    setResendLoading(true)

    try {
      await requestOTP(pendingEmail || email, 'login_2fa')
      setError('A new OTP has been sent to your email.')
    } catch (err) {
      const errorData = err.response?.data || {}
      setError(errorData.detail || errorData.error || err.message || 'Unable to resend OTP')
    } finally {
      setResendLoading(false)
    }
  }

  const handleBackToPassword = () => {
    setOtpStep(false)
    setOtp('')
    setPendingEmail('')
    setError(null)
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-white/40 bg-white/75 p-10 shadow-[0_28px_64px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="space-y-1">
        <h3 className="font-['Manrope'] text-2xl font-bold text-slate-900">
          {otpStep ? 'Verify your login' : 'Sign in to your workspace'}
        </h3>
        <p className="text-sm text-slate-600">
          {otpStep
            ? 'Enter the one-time password sent to your email.'
            : 'Access your document archive, summarization tools, and administrative document Q&A.'}
        </p>
      </div>

      <form onSubmit={otpStep ? handleVerifyOtp : handleLogin} className="mt-8 space-y-4">
        {otpStep ? (
          <>
            <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
              OTP has been sent to <span className="font-semibold">{pendingEmail || email}</span>.
            </div>
            <TextInput
              label="OTP CODE"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
              error={error && error.toLowerCase().includes('otp') ? error : null}
              required
            />
          </>
        ) : (
          <>
            <TextInput
              label="EMAIL ADDRESS"
              type="email"
              placeholder="name@organization.com"
              value={email}
              onChange={setEmail}
              required
            />
            <TextInput
              label="PASSWORD"
              type="password"
              placeholder="password"
              value={password}
              onChange={setPassword}
              helperAction={{
                label: 'Forgot?',
                onClick: handleForgotPassword,
              }}
              required
            />
          </>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <PrimaryButton type="submit" loading={loading}>
            {otpStep ? 'VERIFY OTP' : 'SIGN IN'}
          </PrimaryButton>

          {otpStep ? (
            <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
              <button type="button" onClick={handleBackToPassword} className="text-blue-800 hover:text-blue-700">
                Back to password
              </button>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendLoading}
                className="text-blue-800 hover:text-blue-700 disabled:opacity-50"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 text-[10px] font-bold tracking-[0.16em] text-slate-400">
                <span className="h-px flex-1 bg-slate-200" />
                <span>OR</span>
                <span className="h-px flex-1 bg-slate-200" />
              </div>

              {googleConfigured ? (
                <div className="flex justify-center">
                  <div ref={googleButtonRef} className={googleLoading ? 'pointer-events-none opacity-60' : ''} />
                </div>
              ) : (
                <div className="rounded-lg bg-amber-50 p-3 text-xs font-medium text-amber-800">
                  Google login is not configured. Set VITE_GOOGLE_CLIENT_ID in the frontend environment.
                </div>
              )}
            </>
          )}
        </div>
      </form>

      {!otpStep && (
        <p className="mt-8 text-center text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-semibold text-blue-900 transition hover:text-blue-700"
          >
            Create account
          </Link>
        </p>
      )}
    </section>
  )
}

export default LoginPanel
