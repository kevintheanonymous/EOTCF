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

  // Custom Ethiopian Cross SVG
  const EOTCCross = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C10.9 2 10 2.9 10 4V8H6C4.9 8 4 8.9 4 10V14C4 15.1 4.9 16 6 16H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V16H18C19.1 16 20 15.1 20 14V10C20 8.9 19.1 8 18 8H14V4C14 2.9 13.1 2 12 2ZM12 4V8V4ZM6 10H10H6ZM14 10H18H14ZM10 14V16V14ZM14 14V16V14ZM12 16V20V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 5L12 7M17 12L19 12M12 17L12 19M5 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

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
      setError(result.error.includes('email-already-in-use') ? t('emailInUse') : result.error)
      setLoading(false)
    } else {
      navigate('/verification-pending')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-stone-100">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-50 rounded-full text-deep-gold">
                <EOTCCross className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-dark-brown mb-2">EOTC Toulouse</h1>
          <p className="text-stone-500">{t('signup')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('firstName')}</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('lastName')}</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="input-field" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('email')}</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('phoneNumber')}</label>
            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('password')}</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="input-field" />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">{t('confirmPassword')}</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="input-field" />
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2">
               <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2">
            {loading ? t('loading') : t('signupButton')}
          </button>
        </form>

        <p className="mt-6 text-center text-stone-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-deep-gold font-bold hover:text-amber-700 hover:underline">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp
