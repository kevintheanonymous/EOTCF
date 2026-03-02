/**
 * Security utilities for EOTC Toulouse app
 * Implements OWASP Mobile Security best practices
 */

// ==================== PASSWORD STRENGTH VALIDATION ====================

export const PASSWORD_RULES = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecial: false, // Optional for church members
}

/**
 * Validates password strength
 * @param {string} password 
 * @returns {{ isValid: boolean, errors: string[], strength: 'weak' | 'medium' | 'strong' }}
 */
export const validatePassword = (password) => {
  const errors = []
  let score = 0

  if (password.length < PASSWORD_RULES.minLength) {
    errors.push(`Password must be at least ${PASSWORD_RULES.minLength} characters`)
  } else {
    score += 1
  }

  if (PASSWORD_RULES.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  } else if (/[A-Z]/.test(password)) {
    score += 1
  }

  if (PASSWORD_RULES.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  } else if (/[a-z]/.test(password)) {
    score += 1
  }

  if (PASSWORD_RULES.requireNumber && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  } else if (/[0-9]/.test(password)) {
    score += 1
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1
  }

  let strength = 'weak'
  if (score >= 4) strength = 'strong'
  else if (score >= 3) strength = 'medium'

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score
  }
}

// ==================== RATE LIMITING ====================

const LOGIN_ATTEMPTS_KEY = 'eotc_login_attempts'
const MAX_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 15 * 60 * 1000 // 15 minutes

/**
 * Get current login attempt data from localStorage
 */
const getLoginAttempts = () => {
  try {
    const data = localStorage.getItem(LOGIN_ATTEMPTS_KEY)
    return data ? JSON.parse(data) : { attempts: 0, lastAttempt: null, lockedUntil: null }
  } catch {
    return { attempts: 0, lastAttempt: null, lockedUntil: null }
  }
}

/**
 * Save login attempt data to localStorage
 */
const saveLoginAttempts = (data) => {
  localStorage.setItem(LOGIN_ATTEMPTS_KEY, JSON.stringify(data))
}

/**
 * Check if user is currently rate limited
 * @returns {{ isLocked: boolean, remainingTime: number | null, attemptsLeft: number }}
 */
export const checkRateLimit = () => {
  const data = getLoginAttempts()
  const now = Date.now()

  // Check if locked out
  if (data.lockedUntil && now < data.lockedUntil) {
    const remainingTime = Math.ceil((data.lockedUntil - now) / 1000 / 60)
    return { isLocked: true, remainingTime, attemptsLeft: 0 }
  }

  // Reset if lockout expired
  if (data.lockedUntil && now >= data.lockedUntil) {
    saveLoginAttempts({ attempts: 0, lastAttempt: null, lockedUntil: null })
    return { isLocked: false, remainingTime: null, attemptsLeft: MAX_ATTEMPTS }
  }

  return { 
    isLocked: false, 
    remainingTime: null, 
    attemptsLeft: MAX_ATTEMPTS - data.attempts 
  }
}

/**
 * Record a failed login attempt
 * @returns {{ isLocked: boolean, remainingTime: number | null, attemptsLeft: number }}
 */
export const recordFailedAttempt = () => {
  const data = getLoginAttempts()
  const now = Date.now()
  
  data.attempts += 1
  data.lastAttempt = now

  if (data.attempts >= MAX_ATTEMPTS) {
    data.lockedUntil = now + LOCKOUT_DURATION_MS
    saveLoginAttempts(data)
    return { 
      isLocked: true, 
      remainingTime: Math.ceil(LOCKOUT_DURATION_MS / 1000 / 60), 
      attemptsLeft: 0 
    }
  }

  saveLoginAttempts(data)
  return { 
    isLocked: false, 
    remainingTime: null, 
    attemptsLeft: MAX_ATTEMPTS - data.attempts 
  }
}

/**
 * Reset login attempts after successful login
 */
export const resetLoginAttempts = () => {
  localStorage.removeItem(LOGIN_ATTEMPTS_KEY)
}

// ==================== SESSION SECURITY ====================

const SESSION_KEY = 'eotc_session'
const SESSION_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes of inactivity

/**
 * Update session activity timestamp
 */
export const updateSessionActivity = () => {
  const session = {
    lastActivity: Date.now(),
    created: getSession()?.created || Date.now()
  }
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

/**
 * Get current session data
 */
export const getSession = () => {
  try {
    const data = sessionStorage.getItem(SESSION_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

/**
 * Check if session is still valid (not timed out)
 */
export const isSessionValid = () => {
  const session = getSession()
  if (!session) return false
  
  const now = Date.now()
  return (now - session.lastActivity) < SESSION_TIMEOUT_MS
}

/**
 * Clear session data
 */
export const clearSession = () => {
  sessionStorage.removeItem(SESSION_KEY)
}

// ==================== INPUT SANITIZATION ====================

/**
 * Sanitize user input to prevent XSS
 * @param {string} input 
 * @returns {string}
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return ''
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
}

/**
 * Validate email format
 * @param {string} email 
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}
