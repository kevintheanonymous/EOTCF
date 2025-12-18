import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, Link } from 'react-router-dom'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../config/firebase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [showResetModal, setShowResetModal] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  
  const { login } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  // Custom Ethiopian Cross SVG
  const EOTCCross = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C10.9 2 10 2.9 10 4V8H6C4.9 8 4 8.9 4 10V14C4 15.1 4.9 16 6 16H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V16H18C19.1 16 20 15.1 20 14V10C20 8.9 19.1 8 18 8H14V4C14 2.9 13.1 2 12 2ZM12 4V8V4ZM6 10H10H6ZM14 10H18H14ZM10 14V16V14ZM14 14V16V14ZM12 16V20V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 5L12 7M17 12L19 12M12 17L12 19M5 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

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
      setResetEmail('')
    } catch (err) {
      setError('Failed to send reset email. ' + err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment relative">
      
      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full animate-fade-in">
            <div className="flex justify-center mb-4 text-deep-gold">
               <EOTCCross className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-serif text-center font-bold text-dark-brown mb-2">Reset Password</h3>
            <p className="text-stone-500 text-center mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handlePasswordReset}>
                <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input-field mb-4"
                    placeholder="name@example.com"
                    required
                />
                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => { setShowResetModal(false); setError(''); setMessage(''); }} 
                        className="flex-1 btn-secondary"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        className="flex-1 btn-primary"
                    >
                        {loading ? 'Sending...' : 'Send Link'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      <div className="w-full flex min-h-screen">
        {/* Left Side - Decorative (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 bg-gold-gradient relative overflow-hidden items-center justify-center">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-white text-center p-12">
            <div className="mb-6 inline-block p-6 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30">
                <EOTCCross className="w-20 h-20 text-white" />
            </div>
            <h1 className="text-5xl font-serif font-bold mb-4">EOTC Toulouse</h1>
            <p className="text-xl text-white/90 font-light">Finance & Inventory Management System</p>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-warm-parchment">
            <div className="max-w-md w-full bg-white lg:bg-transparent rounded-3xl shadow-xl lg:shadow-none p-8 lg:p-0 border border-stone-100 lg:border-none">
                <div className="text-center mb-8 lg:text-left">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-4">
                        <div className="p-3 bg-amber-50 rounded-full text-deep-gold">
                            <EOTCCross className="w-10 h-10" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-dark-brown mb-2">{t('login')}</h2>
                    <p className="text-stone-500">Welcome back! Please enter your details.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="input-field"
                            placeholder="name@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">{t('password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="input-field"
                            placeholder="••••••••"
                        />
                        <div className="text-right mt-2">
                            <button 
                                type="button"
                                onClick={() => setShowResetModal(true)}
                                className="text-sm text-deep-gold hover:text-amber-700 font-semibold transition-colors"
                            >
                                Forgot password?
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {error}
                        </div>
                    )}
                    
                    {message && (
                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-center gap-3">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            {message}
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-lg">
                        {loading ? t('loading') : t('loginButton')}
                    </button>
                </form>

                <p className="mt-8 text-center text-stone-500 text-sm">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-deep-gold font-bold hover:text-amber-700 hover:underline">
                    {t('signup')}
                    </Link>
                </p>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Login
