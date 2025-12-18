import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth' // Import reset function
import { auth } from '../config/firebase' // Import auth instance

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('') // For success messages
  const [loading, setLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false) // Toggle reset modal
  const [resetEmail, setResetEmail] = useState('')
  
  const { login } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const result = await login(email, password)
    
    if (!result.success) {
      if (result.error.includes('wrong-password') || result.error.includes('invalid-credential')) {
        setError(t('incorrectPassword'))
      } else {
        setError(result.error)
      }
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  // Handle Password Reset
  const handlePasswordReset = async (e) => {
    e.preventDefault()
    if (!resetEmail) return
    
    setLoading(true)
    setError('')
    setMessage('')
    
    try {
      await sendPasswordResetEmail(auth, resetEmail)
      setMessage('Password reset email sent! Check your inbox.')
      setShowResetModal(false)
      setResetEmail('') // Clear email field after success
    } catch (err) {
      setError('Failed to send reset email. ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment px-4 relative">
      
      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-8 max-w-sm w-full">
            <h3 className="text-xl font-serif text-deep-gold mb-4">Reset Password</h3>
            <p className="text-stone-600 mb-4 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handlePasswordReset}>
                <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold mb-4"
                    placeholder="name@example.com"
                    required
                />
                <div className="flex gap-2">
                    <button 
                        type="button" 
                        onClick={() => { setShowResetModal(false); setError(''); setMessage(''); }} 
                        className="flex-1 py-2 text-sm bg-gray-200 text-dark-brown rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-1 py-2 text-sm bg-deep-gold text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Link'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-deep-gold mb-2">EOTC Toulouse</h1>
          <p className="text-dark-brown">{t('login')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
            <div className="text-right mt-1">
                <button 
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-xs text-deep-gold hover:underline font-medium"
                >
                    Forgot password?
                </button>
            </div>
          </div>

          {error && (
            <div className="bg-liturgical-red/10 border border-liturgical-red text-liturgical-red px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-emerald-green/10 border border-emerald-green text-emerald-green px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-deep-gold text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {loading ? t('loading') : t('loginButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-dark-brown">
          {t('signup')}?{' '}
          <Link to="/signup" className="text-deep-gold hover:underline">
            {t('signup')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
