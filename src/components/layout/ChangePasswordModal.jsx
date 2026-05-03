import { useState } from 'react'
import { X, Eye, EyeOff } from 'lucide-react'
import { changePassword } from '../../services/authService'

function ChangePasswordModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const toggleShowPassword = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    // Validate
    if (!formData.oldPassword || !formData.newPassword || !formData.newPasswordConfirm) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (formData.newPassword !== formData.newPasswordConfirm) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters')
      setLoading(false)
      return
    }

    try {
      await changePassword(
        formData.oldPassword,
        formData.newPassword,
        formData.newPasswordConfirm
      )
      
      setSuccess(true)
      setFormData({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      })
      
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 1500)
    } catch (err) {
      const errorData = err.response?.data || {}
      setError(errorData.detail || err.message || 'Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Change Password</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password */}
          <div>
            <label htmlFor="oldPassword" className="mb-2 block text-sm font-semibold text-slate-700">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.old ? 'text' : 'password'}
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 text-slate-900 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your current password"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('old')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="newPassword" className="mb-2 block text-sm font-semibold text-slate-700">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 text-slate-900 focus:border-blue-500 focus:outline-none"
                placeholder="Enter your new password"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="newPasswordConfirm" className="mb-2 block text-sm font-semibold text-slate-700">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="newPasswordConfirm"
                name="newPasswordConfirm"
                value={formData.newPasswordConfirm}
                onChange={handleInputChange}
                className="w-full rounded-lg border border-slate-300 px-4 py-2 pr-10 text-slate-900 focus:border-blue-500 focus:outline-none"
                placeholder="Confirm your new password"
              />
              <button
                type="button"
                onClick={() => toggleShowPassword('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
              ✓ Password changed successfully!
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-blue-900 px-4 py-2 font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal
