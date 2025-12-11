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

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment px-4">
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
          </div>

          {error && (
            <div className="bg-liturgical-red/10 border border-liturgical-red text-liturgical-red px-4 py-3 rounded-lg">
              {error}
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

