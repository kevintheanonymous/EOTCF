import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, Link } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (formData.password.length < 6) {
      setError(t('weakPassword'))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDontMatch'))
      return
    }

    setLoading(true)

    const { confirmPassword, ...userData } = formData
    const result = await signup(formData.email, formData.password, userData)
    
    if (!result.success) {
      if (result.error.includes('email-already-in-use')) {
        setError(t('emailInUse'))
      } else {
        setError(result.error)
      }
      setLoading(false)
    } else {
      navigate('/verification-pending')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-deep-gold mb-2">EOTC Toulouse</h1>
          <p className="text-dark-brown">{t('signup')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('firstName')}
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('lastName')}
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('phoneNumber')}
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-brown mb-2">
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {loading ? t('loading') : t('signupButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-dark-brown">
          {t('login')}?{' '}
          <Link to="/login" className="text-deep-gold hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp

