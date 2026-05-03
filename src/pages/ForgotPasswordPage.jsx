import { useState } from 'react'
import { Link } from 'react-router-dom'
import { requestPasswordReset, verifyOTP, confirmPasswordReset } from '../services/authService'
import PrimaryButton from '../components/ui/PrimaryButton'
import FormInputField from '../components/ui/FormInputField'

function ForgotPasswordPage() {
  const [step, setStep] = useState('request') // request -> verify
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleRequest = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!email) {
      setError('Please enter your email')
      return
    }

    setLoading(true)
    try {
      await requestPasswordReset(email)
      setMessage('If an account exists with that email, an OTP has been sent.')
      setStep('verify')
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyAndReset = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!otp) {
      setError('Please enter the OTP sent to your email')
      return
    }
    if (!password || !passwordConfirm) {
      setError('Please enter and confirm your new password')
      return
    }
    if (password !== passwordConfirm) {
      setError('Passwords do not match')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    try {
      // Verify OTP to get reset token
      const otpResp = await verifyOTP(email, otp, 'password_reset')
      const resetToken = otpResp.reset_token

      // Confirm password reset with token
      await confirmPasswordReset(resetToken, password, passwordConfirm)

      setMessage('Password reset successful. Redirecting to login...')
      setTimeout(() => {
        window.location.href = '/login'
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Reset failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Forgot Password</h1>

          {step === 'request' && (
            <form onSubmit={handleRequest} className="space-y-4">
              <FormInputField
                label="Email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={setEmail}
              />

              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              {message && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}

              <PrimaryButton type="submit" loading={loading}>Send OTP</PrimaryButton>

              <div className="text-sm text-slate-600 mt-4">
                <Link to="/login" className="text-blue-800 font-bold">Back to login</Link>
              </div>
            </form>
          )}

          {step === 'verify' && (
            <form onSubmit={handleVerifyAndReset} className="space-y-4">
              <FormInputField
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                disabled
              />

              <FormInputField
                label="OTP code"
                placeholder="123456"
                value={otp}
                onChange={setOtp}
              />

              <FormInputField
                label="New Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
              />

              <FormInputField
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
                value={passwordConfirm}
                onChange={setPasswordConfirm}
              />

              {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
              {message && <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">{message}</div>}

              <PrimaryButton type="submit" loading={loading}>Reset Password</PrimaryButton>

              <div className="text-sm text-slate-600 mt-4">
                <button type="button" onClick={() => setStep('request')} className="text-blue-800 font-bold">Resend OTP</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

export default ForgotPasswordPage
