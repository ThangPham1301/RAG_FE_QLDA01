import { useState, useRef } from 'react'
import { X, Upload } from 'lucide-react'
import { updateProfile, uploadAvatar } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'

function EditProfileModal({ isOpen, onClose, user, onSuccess }) {
  const { updateUser } = useAuth()
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
    avatar_url: user?.avatar_url || '',
  })
  const [loading, setLoading] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAvatarClick = () => {
    setError(null)
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploadingAvatar(true)
    try {
      const response = await uploadAvatar(file)
      setFormData(prev => ({
        ...prev,
        avatar_url: response.avatar_url || ''
      }))
      updateUser(response)
    } catch (err) {
      const errorData = err.response?.data || {}
      setError(errorData.error || errorData.detail || err.message || 'Failed to upload avatar')
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await updateProfile({
        first_name: formData.first_name,
        last_name: formData.last_name,
        bio: formData.bio,
        avatar_url: formData.avatar_url,
      })
      
      updateUser(response)
      onSuccess?.()
      onClose()
    } catch (err) {
      const errorData = err.response?.data || {}
      setError(errorData.detail || err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Edit Profile</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Avatar Upload */}
          <div>
            <label className="mb-3 block text-sm font-semibold text-slate-700">Avatar</label>
            <div className="flex items-center gap-4">
              {formData.avatar_url && (
                <img
                  src={formData.avatar_url}
                  alt="Preview"
                  className="h-24 w-24 rounded-lg object-cover"
                />
              )}
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadingAvatar}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Upload size={16} />
                {uploadingAvatar ? 'Uploading...' : formData.avatar_url ? 'Change' : 'Upload'} Avatar
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>

          {/* First Name */}
          <div>
            <label htmlFor="first_name" className="mb-2 block text-sm font-semibold text-slate-700">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="John"
            />
          </div>

          {/* Last Name */}
          <div>
            <label htmlFor="last_name" className="mb-2 block text-sm font-semibold text-slate-700">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Doe"
            />
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="mb-2 block text-sm font-semibold text-slate-700">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows="4"
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
              placeholder="Tell us about yourself..."
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {error}
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
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfileModal
