import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

const VerificationPending = () => {
  const { language } = useLanguage()
  const { userRole, logout } = useAuth()
  const navigate = useNavigate()
  const t = (key) => getTranslation(language, key)

  useEffect(() => {
    if (userRole && userRole !== 'pending') {
      navigate('/dashboard')
    }
  }, [userRole, navigate])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-deep-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-deep-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-serif text-deep-gold mb-2">{t('verificationPending')}</h1>
          <p className="text-dark-brown">{t('verificationMessage')}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-gray-200 text-dark-brown rounded-lg hover:bg-gray-300 transition-colors"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

export default VerificationPending

