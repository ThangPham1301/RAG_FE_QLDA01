/**
 * Get stored access token
 */
export const getAccessToken = () => {
  return localStorage.getItem('accessToken')
}

/**
 * Get stored refresh token
 */
export const getRefreshToken = () => {
  return localStorage.getItem('refreshToken')
}

/**
 * Get stored user
 */
export const getStoredUser = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAccessToken()
}

/**
 * Set tokens
 */
export const setTokens = (accessToken, refreshToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
  }
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }
}

/**
 * Clear all auth data
 */
export const clearAuth = () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('user')
}

/**
 * Set user
 */
export const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
}

/**
 * Format email for display (truncate)
 */
export const formatEmail = (email) => {
  if (!email) return ''
  const [localPart, domain] = email.split('@')
  if (localPart.length > 10) {
    return `${localPart.substring(0, 10)}...@${domain}`
  }
  return email
}

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
  const requirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  }
  
  return {
    isStrong: Object.values(requirements).every(Boolean),
    requirements,
  }
}

/**
 * Get password strength percentage
 */
export const getPasswordStrength = (password) => {
  const { requirements } = validatePassword(password)
  const metRequirements = Object.values(requirements).filter(Boolean).length
  return (metRequirements / Object.keys(requirements).length) * 100
}
