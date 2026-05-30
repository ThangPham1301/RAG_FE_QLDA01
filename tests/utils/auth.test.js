import {
  AUTH_LOGOUT_EVENT,
  clearAuth,
  formatEmail,
  getAccessToken,
  getPasswordStrength,
  getRefreshToken,
  getStoredUser,
  isAuthenticated,
  setTokens,
  setUser,
  validateEmail,
  validatePassword,
} from '../../src/utils/auth'

describe('auth utilities', () => {
  test('stores and reads tokens and user data', () => {
    setTokens('access-token', 'refresh-token')
    setUser({ email: 'user@example.com', role: 'admin' })

    expect(getAccessToken()).toBe('access-token')
    expect(getRefreshToken()).toBe('refresh-token')
    expect(getStoredUser()).toEqual({ email: 'user@example.com', role: 'admin' })
    expect(isAuthenticated()).toBe(true)
  })

  test('clears auth data and optionally emits logout event with reason', () => {
    setTokens('access-token', 'refresh-token')
    setUser({ email: 'user@example.com' })
    const listener = jest.fn()
    window.addEventListener(AUTH_LOGOUT_EVENT, listener)

    clearAuth({ notify: true, reason: 'session_expired' })

    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
    expect(getStoredUser()).toBeNull()
    expect(listener).toHaveBeenCalledTimes(1)
    expect(listener.mock.calls[0][0].detail).toEqual({ reason: 'session_expired' })
    window.removeEventListener(AUTH_LOGOUT_EVENT, listener)
  })

  test('validates email and password strength rules', () => {
    expect(validateEmail('valid@example.com')).toBe(true)
    expect(validateEmail('invalid-email')).toBe(false)

    expect(validatePassword('Weak1').isStrong).toBe(false)
    expect(validatePassword('Strong1!').isStrong).toBe(true)
    expect(getPasswordStrength('Strong1!')).toBe(100)
  })

  test('formats long emails without changing short emails', () => {
    expect(formatEmail('short@example.com')).toBe('short@example.com')
    expect(formatEmail('averylonglocalpart@example.com')).toBe('averylongl...@example.com')
    expect(formatEmail('')).toBe('')
  })
})
