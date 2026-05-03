import { useState } from 'react'
import apiClient from '../../services/api'

export function LoginDebugger() {
  const [email, setEmail] = useState('test@example.com')
  const [password, setPassword] = useState('TestPassword123!@#')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      console.log('🔄 Sending login request...')
      console.log('Email:', email)
      console.log('Password:', password)

      const response = await apiClient.post('/auth/login', {
        email,
        password,
      })

      console.log('✅ Login successful!')
      console.log('Response:', response)
      console.log('Response data:', response.data)

      setResult({
        status: 'success',
        message: response.data.message,
        user: response.data.user,
        tokens: {
          access: response.data.tokens?.access?.substring(0, 50) + '...',
          refresh: response.data.tokens?.refresh?.substring(0, 50) + '...',
        },
        sessionId: response.data.session_id,
      })

      // Check localStorage
      const savedTokens = {
        access: localStorage.getItem('accessToken')?.substring(0, 50),
        refresh: localStorage.getItem('refreshToken')?.substring(0, 50),
      }
      const savedUser = localStorage.getItem('user')

      console.log('📦 Saved in localStorage:')
      console.log('Access Token:', savedTokens.access)
      console.log('Refresh Token:', savedTokens.refresh)
      console.log('User:', savedUser)

      setResult((prev) => ({
        ...prev,
        localStorage: {
          accessToken: savedTokens.access ? '✅ Saved' : '❌ Not saved',
          refreshToken: savedTokens.refresh ? '✅ Saved' : '❌ Not saved',
          user: savedUser ? '✅ Saved' : '❌ Not saved',
        },
      }))
    } catch (err) {
      console.error('❌ Login failed!')
      console.error('Error:', err)
      console.error('Response status:', err.response?.status)
      console.error('Response data:', err.response?.data)

      setResult({
        status: 'error',
        message: err.response?.data?.detail || err.message,
        fullError: {
          status: err.response?.status,
          data: err.response?.data,
          message: err.message,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-50 max-h-96 overflow-auto">
      <h3 className="font-bold text-lg mb-3">🔍 Login Debugger</h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm"
          />
        </div>

        <button
          onClick={testLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Login'}
        </button>
      </div>

      {result && (
        <div className="border-t pt-3">
          <h4 className="font-semibold mb-2">
            {result.status === 'success' ? '✅ Result' : '❌ Error'}
          </h4>

          {result.status === 'success' && (
            <div className="space-y-2 text-xs">
              <p className="text-green-600 font-semibold">{result.message}</p>

              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold">User:</p>
                <p>Email: {result.user?.email}</p>
                <p>Name: {result.user?.first_name} {result.user?.last_name}</p>
              </div>

              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold">Tokens:</p>
                <p>Access: {result.tokens?.access}</p>
                <p>Refresh: {result.tokens?.refresh}</p>
              </div>

              <div className="bg-gray-100 p-2 rounded">
                <p className="font-semibold">localStorage:</p>
                <p className={result.localStorage?.accessToken?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {result.localStorage?.accessToken}
                </p>
                <p className={result.localStorage?.refreshToken?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {result.localStorage?.refreshToken}
                </p>
                <p className={result.localStorage?.user?.includes('✅') ? 'text-green-600' : 'text-red-600'}>
                  {result.localStorage?.user}
                </p>
              </div>

              <p className="text-gray-600">Session ID: {result.sessionId}</p>
            </div>
          )}

          {result.status === 'error' && (
            <div className="space-y-2 text-xs">
              <p className="text-red-600 font-semibold">{result.message}</p>

              <div className="bg-red-50 p-2 rounded border border-red-200">
                <p className="font-semibold text-red-800">Status: {result.fullError?.status}</p>
                <pre className="text-red-700 text-xs whitespace-pre-wrap break-words mt-1">
                  {JSON.stringify(result.fullError?.data, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-3">Check browser console (F12) for more details</p>
        </div>
      )}
    </div>
  )
}
