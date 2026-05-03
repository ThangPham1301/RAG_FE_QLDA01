import googleIcon from '../../assets/auth/google.png'
import ssoIcon from '../../assets/auth/sso.png'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import PrimaryButton from '../ui/PrimaryButton'
import OrDivider from '../ui/OrDivider'
import SocialButton from '../ui/SocialButton'
import TextInput from '../ui/TextInput'
import { useAuth } from '../../context/AuthContext'
import { googleLogin, login } from '../../services/authService'

function LoginPanel() {
  const navigate = useNavigate()
  const { login: authLogin, setError: setAuthError } = useAuth()
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState(null)
  const [googleReady, setGoogleReady] = useState(false)
  const googleButtonRef = useRef(null)

  useEffect(() => {
    if (!googleClientId) {
      return undefined
    }

    let cancelled = false

    const initializeGoogle = () => {
      if (cancelled || !window.google?.accounts?.id) {
        return
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (credentialResponse) => {
          if (!credentialResponse?.credential) {
            setGoogleLoading(false)
            setError('Google login failed to return a token.')
            return
          }

          setGoogleLoading(true)
          setError(null)

          try {
            const response = await googleLogin(credentialResponse.credential)
            authLogin(response.user, response.tokens)
            navigate('/dashboard', { replace: true })
          } catch (err) {
            const errorData = err.response?.data || {}
            const errorMessage = errorData.error || errorData.detail || err.message || 'Google login failed'
            setError(errorMessage)
            setAuthError(errorMessage)
          } finally {
            setGoogleLoading(false)
          }
        },
      })

      if (googleButtonRef.current) {
        googleButtonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          shape: 'rectangular',
          text: 'signin_with',
          width: 320,
        })
      }

      setGoogleReady(true)
    }

    if (window.google?.accounts?.id) {
      initializeGoogle()
      return () => {
        cancelled = true
      }
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initializeGoogle
    document.head.appendChild(script)

    return () => {
      cancelled = true
    }
  }, [authLogin, googleClientId, navigate, setAuthError])

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
      authLogin(response.user, response.tokens)
      
      console.log('✨ [LOGIN] authLogin() completed')
      console.log('🚀 [LOGIN] Navigating to /dashboard...')
      navigate('/dashboard')
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
            SIGN IN TO DASHBOARD
          </PrimaryButton>
          <Link
            to="/chat"
            className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            GO TO CHAT (DEMO)
          </Link>
          <OrDivider text="OR CONTINUE WITH" />
          <div className="flex flex-col gap-4">
            <div className="flex justify-center">
              <div ref={googleButtonRef} className={googleLoading ? 'pointer-events-none opacity-60' : ''} />
            </div>
            <SocialButton icon={ssoIcon} label="SSO" />
          </div>
        </div>
      </form>

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