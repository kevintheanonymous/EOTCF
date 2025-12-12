import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    if (!result.success) {
      setError(t('incorrectPassword') || 'Failed to login')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex bg-warm-parchment">
      {/* Left Side - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gold-gradient relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 text-white text-center p-12">
          <div className="mb-6 inline-block p-4 rounded-full bg-white/20 backdrop-blur-md">
            <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-5xl font-serif font-bold mb-4">EOTC Toulouse</h1>
          <p className="text-xl text-white/90 font-light">Finance & Inventory Management System</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <div className="text-center mb-10 lg:text-left">
            <h2 className="text-3xl font-serif font-bold text-dark-brown mb-2">{t('login')}</h2>
            <p className="text-stone-500">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">{t('email')}</label>
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
              <label className="block text-sm font-medium text-stone-700 mb-2">{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? t('loading') : t('loginButton')}
            </button>
          </form>

          <p className="mt-8 text-center text-stone-500 text-sm">
            {t('signup')}?{' '}
            <Link to="/signup" className="text-deep-gold font-semibold hover:text-amber-700 hover:underline">
              {t('signup')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
