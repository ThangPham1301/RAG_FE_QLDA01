import apiClient from './api'

/**
 * Sign up with email and password
 */
export const signUp = async (data) => {
  const response = await apiClient.post('/auth/signup', {
    email: data.email,
    first_name: data.firstName || '',
    last_name: data.lastName || '',
    password: data.password,
    password_confirm: data.passwordConfirm,
  })
  return response.data
}

/**
 * Verify email with token
 */
export const verifyEmail = async (token) => {
  const response = await apiClient.post('/auth/verify-email', {
    token,
  })
  return response.data
}

/**
 * Login with email and password
 */
export const login = async (email, password) => {
  const response = await apiClient.post('/auth/login', {
    email,
    password,
  })
  
  // Store tokens
  if (response.data.tokens) {
    localStorage.setItem('accessToken', response.data.tokens.access)
    localStorage.setItem('refreshToken', response.data.tokens.refresh)
  }
  
  // Store user info
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  return response.data
}

/**
 * Login with Google OAuth
 */
export const googleLogin = async (idToken, accessToken) => {
  const response = await apiClient.post('/auth/google/callback', {
    id_token: idToken,
    access_token: accessToken,
  })
  
  // Store tokens
  if (response.data.tokens) {
    localStorage.setItem('accessToken', response.data.tokens.access)
    localStorage.setItem('refreshToken', response.data.tokens.refresh)
  }
  
  // Store user info
  if (response.data.user) {
    localStorage.setItem('user', JSON.stringify(response.data.user))
  }
  
  return response.data
}

/**
 * Request OTP for password reset or login
 */
export const requestOTP = async (email, purpose = 'password_reset') => {
  const response = await apiClient.post('/auth/request-otp', {
    email,
    purpose,
  })
  return response.data
}

/**
 * Verify OTP
 */
export const verifyOTP = async (email, otp, purpose = 'password_reset') => {
  const response = await apiClient.post('/auth/verify-otp', {
    email,
    otp,
    purpose,
  })
  return response.data
}

/**
 * Request password reset
 */
export const requestPasswordReset = async (email) => {
  const response = await apiClient.post('/auth/password-reset/request', {
    email,
  })
  return response.data
}

/**
 * Confirm password reset with new password
 */
export const confirmPasswordReset = async (token, password, passwordConfirm) => {
  const response = await apiClient.post('/auth/password-reset/confirm', {
    token,
    password,
    password_confirm: passwordConfirm,
  })
  return response.data
}

/**
 * Get current user
 */
export const getCurrentUser = async () => {
  const response = await apiClient.get('/auth/me')
  return response.data
}

/**
 * Update user profile
 */
export const updateProfile = async (data) => {
  const response = await apiClient.put('/auth/profile', data)
  
  // Update stored user info
  localStorage.setItem('user', JSON.stringify(response.data))
  
  return response.data
}

/**
 * Upload avatar via backend.
 */
export const uploadAvatar = async (file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await apiClient.post('/auth/profile/avatar', formData)
  localStorage.setItem('user', JSON.stringify(response.data))
  return response.data
}

/**
 * Change password
 */
export const changePassword = async (oldPassword, newPassword, newPasswordConfirm) => {
  const response = await apiClient.post('/auth/change-password', {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirm: newPasswordConfirm,
  })
  return response.data
}

/**
 * Get active sessions
 */
export const getSessions = async () => {
  const response = await apiClient.get('/auth/sessions')
  return response.data
}

/**
 * Logout all sessions
 */
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout')
  } finally {
    // Clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }
}

/**
 * Logout from specific device
 */
export const logoutDevice = async (sessionId) => {
  const response = await apiClient.post('/auth/logout-device', {
    session_id: sessionId,
  })
  return response.data
}

/**
 * Refresh access token
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await apiClient.post('/auth/token/refresh', {
    refresh: refreshToken,
  })

  localStorage.setItem('accessToken', response.data.access)
  if (response.data.refresh) {
    localStorage.setItem('refreshToken', response.data.refresh)
  }

  return response.data
}
