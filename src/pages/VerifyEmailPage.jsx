import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { verifyEmail } from '../services/authService'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading, success, error
  const [message, setMessage] = useState('')
  const token = searchParams.get('token')

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setStatus('error')
        setMessage('No verification token provided. Please check your email link.')
        return
      }

      try {
        const response = await verifyEmail(token)
        setStatus('success')
        setMessage(response.message || 'Your email has been verified successfully.')
      } catch (err) {
        setStatus('error')
        const errorMsg = err.response?.data?.detail || err.message || 'Email verification failed'
        setMessage(errorMsg)
      }
    }

    verifyEmailToken()
  }, [token])

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f8ff] p-4 font-['Inter']">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/60 bg-white p-8 shadow-[0_24px_60px_rgba(15,23,42,0.12)]">
          {status === 'loading' && (
            <div className="space-y-4 text-center">
              <div className="flex justify-center">
                <Loader className="h-12 w-12 animate-spin text-blue-700" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Verifying Email</h1>
              <p className="text-slate-600">Please wait while we verify your email address...</p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <CheckCircle className="h-14 w-14 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Email Verified</h1>
              <p className="text-slate-600">{message}</p>
              <Link
                to="/login"
                className="inline-flex w-full items-center justify-center rounded-xl bg-blue-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                Go to Login Page
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5 text-center">
              <div className="flex justify-center">
                <AlertCircle className="h-14 w-14 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
              <p className="text-slate-600">{message}</p>
              <div className="mt-6 space-y-2">
                <p className="text-sm text-slate-500">
                  If the link is expired or invalid, you can:
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    to="/register"
                    className="px-4 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                  >
                    Sign Up Again
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-600">
            <p>Need help? <span className="text-blue-700">Contact Support</span></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default VerifyEmailPage
