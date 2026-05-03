import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { verifyEmail } from '../services/authService'

function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
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
        setMessage(response.message || 'Email verified successfully! Redirecting to login...')
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      } catch (err) {
        setStatus('error')
        const errorMsg = err.response?.data?.detail || err.message || 'Email verification failed'
        setMessage(errorMsg)
      }
    }

    verifyEmailToken()
  }, [token, navigate])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Loading State */}
          {status === 'loading' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Loader className="w-12 h-12 text-blue-600 animate-spin" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Verifying Email</h1>
              <p className="text-slate-600">Please wait while we verify your email address...</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Email Verified!</h1>
              <p className="text-slate-600">{message}</p>
              <p className="text-sm text-slate-500 mt-4">Redirecting to login...</p>
              <Link
                to="/login"
                className="inline-block mt-4 px-6 py-2 bg-blue-900 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <AlertCircle className="w-12 h-12 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Verification Failed</h1>
              <p className="text-slate-600">{message}</p>
              <div className="space-y-2 mt-6">
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

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-600">
            <p>Need help? <a href="#" className="text-blue-600 hover:underline">Contact Support</a></p>
          </div>
        </div>
      </div>
    </main>
  )
}

export default VerifyEmailPage
