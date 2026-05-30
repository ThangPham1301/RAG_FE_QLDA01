import { Link, useNavigate } from 'react-router-dom'
import { useCallback, useEffect, useRef, useState } from 'react'
import PrimaryButton from '../ui/PrimaryButton'
import TextInput from '../ui/TextInput'
import { useAuth } from '../../context/AuthContext'
import { isAdminUser } from '../ProtectedRoute'
import { googleLogin, login, verifyLoginOTP } from '../../services/authService'

function LoginPanel() {
  const navigate = useNavigate()
  const { login: authLogin, setError: setAuthError } = useAuth()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [loginStep, setLoginStep] = useState('credentials')
  const [pendingEmail, setPendingEmail] = useState('')
  const [challengeToken, setChallengeToken] = useState('')
  const [otp, setOtp] = useState('')
  const googleButtonRef = useRef(null)
  const googleConfigured = Boolean(googleClientId && !googleClientId.startsWith('your-'))

  const completeLogin = useCallback((response) => {
    authLogin(response.user, response.tokens)
    navigate(isAdminUser(response.user) ? '/dashboard' : '/library', { replace: true })
  }, [authLogin, navigate])

  const startTwoFactorStep = useCallback((response) => {
    setPendingEmail(response.email || email)
    setChallengeToken(response.challenge_token || '')
    setOtp('')
    setLoginStep('otp')
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
          startTwoFactorStep(response)
          return
        }
        completeLogin(response)
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
  }, [completeLogin, googleClientId, googleConfigured, setAuthError, startTwoFactorStep])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    console.log('🔄 [LOGIN] Starting login process...')
    console.log('📧 Email:', email)

    try {
      console.log('📡 [LOGIN] Calling authService.login()...')
      const response = await login(email, password)

      if (response.requires_2fa) {
        startTwoFactorStep(response)
        return
      }
      
      console.log('✅ [LOGIN] Login response received:')
      console.log('   Message:', response.message)
      console.log('   User:', response.user)
      console.log('   Tokens:', {
        access: response.tokens?.access ? '✅ Present' : '❌ Missing',
        refresh: response.tokens?.refresh ? '✅ Present' : '❌ Missing',
      })

      // Check localStorage after login
      const storedAccess = localStorage.getItem('accessToken')
      const storedRefresh = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem('user')
      
      console.log('💾 [LOGIN] localStorage after login:')
      console.log('   accessToken:', storedAccess ? '✅ Saved (' + storedAccess.substring(0, 20) + '...)' : '❌ Not saved')
      console.log('   refreshToken:', storedRefresh ? '✅ Saved (' + storedRefresh.substring(0, 20) + '...)' : '❌ Not saved')
      console.log('   user:', storedUser ? '✅ Saved' : '❌ Not saved')

      console.log('🔐 [LOGIN] Calling authLogin() from context...')
      completeLogin(response)
      
      console.log('✨ [LOGIN] authLogin() completed')
      console.log('🚀 [LOGIN] Navigating after role check...')
      console.log('✅ [LOGIN] Navigate called (should redirect now)')
    } catch (err) {
      console.error('❌ [LOGIN] Error during login:', err)
      console.error('   Response status:', err.response?.status)
      console.error('   Response data:', err.response?.data)
      console.error('   Error message:', err.message)

      // Comprehensive error handling for different formats
      const errorData = err.response?.data || {}
      let errorMessage = 'Login failed'

      // Priority: detail > first field error > generic message
      if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (errorData.email?.[0]) {
        errorMessage = errorData.email[0]
      } else if (errorData.password?.[0]) {
        errorMessage = errorData.password[0]
      } else if (err.message) {
        errorMessage = err.message
      }

      // Handle specific error cases
      if (errorData.code === 'email_not_verified') {
        errorMessage = 'Tài khoản chưa xác thực email. Hệ thống đã gửi lại email xác thực, vui lòng kiểm tra hộp thư và xác nhận.'
      }

      if (errorMessage.includes('Email not verified')) {
        errorMessage = 'Please verify your email before logging in. Check your inbox for the verification link.'
      }

      console.error('📢 [LOGIN] Setting error message:', errorMessage)
      setError(errorMessage)
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
      console.log('⏹️  [LOGIN] Login process finished')
    }
  }

  const handleForgotPassword = () => {
    // TODO: Implement forgot password flow
    navigate('/forgot-password')
  }

  const handleVerifyLoginOTP = async (e) => {
    e.preventDefault()
    setError(null)

    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP sent to your email')
      return
    }

    setLoading(true)

    try {
      const response = await verifyLoginOTP(pendingEmail, otp, challengeToken)
      completeLogin(response)
    } catch (err) {
      const errorData = err.response?.data || {}
      const errorMessage = errorData.detail || err.message || 'OTP verification failed'
      setError(errorMessage)
      setAuthError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToCredentials = () => {
    setLoginStep('credentials')
    setChallengeToken('')
    setOtp('')
    setError(null)
  }

  return (
    <section className="w-full max-w-md rounded-2xl border border-white/40 bg-white/75 p-10 shadow-[0_28px_64px_rgba(15,23,42,0.14)] backdrop-blur-xl">
      <div className="space-y-1">
        <h3 className="font-['Manrope'] text-2xl font-bold text-slate-900">
          Sign in to your workspace
        </h3>
        <p className="text-sm text-slate-600">
          Access your document archive, summarization tools, and administrative document Q&A.
        </p>
      </div>

      {loginStep === 'otp' ? (
        <form onSubmit={handleVerifyLoginOTP} className="mt-8 space-y-4">
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">
            We sent a 6-digit verification code to {pendingEmail}. Enter it to finish signing in.
          </div>

          <TextInput
            label="OTP CODE"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
            error={error}
            required
          />

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <PrimaryButton type="submit" loading={loading}>
            VERIFY AND SIGN IN
          </PrimaryButton>

          <button
            type="button"
            onClick={handleBackToCredentials}
            className="w-full text-center text-sm font-semibold text-blue-900 transition hover:text-blue-700"
          >
            Back to email and password
          </button>
        </form>
      ) : (
      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <TextInput
          label="EMAIL ADDRESS"
          type="email"
          placeholder="name@organization.com"
          value={email}
          onChange={setEmail}
          error={error && !password ? error : null}
          required
        />
        <TextInput
          label="PASSWORD"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={setPassword}
          helperAction={{
            label: 'Forgot?',
            onClick: handleForgotPassword,
          }}
          error={error && email ? error : null}
          required
        />

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <PrimaryButton type="submit" loading={loading}>
            SIGN IN
          </PrimaryButton>

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
        </div>
      </form>
      )}

      <p className="mt-8 text-center text-sm text-slate-600">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-semibold text-blue-900 transition hover:text-blue-700"
        >
          Create account
        </Link>
      </p>
    </section>
  )
}

export default LoginPanel
