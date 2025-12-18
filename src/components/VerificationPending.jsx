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

  // Custom Ethiopian Cross SVG
  const EOTCCross = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C10.9 2 10 2.9 10 4V8H6C4.9 8 4 8.9 4 10V14C4 15.1 4.9 16 6 16H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V16H18C19.1 16 20 15.1 20 14V10C20 8.9 19.1 8 18 8H14V4C14 2.9 13.1 2 12 2ZM12 4V8V4ZM6 10H10H6ZM14 10H18H14ZM10 14V16V14ZM14 14V16V14ZM12 16V20V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 5L12 7M17 12L19 12M12 17L12 19M5 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-parchment px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center border border-stone-100">
        <div className="mb-6">
          <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-deep-gold">
            <EOTCCross className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-dark-brown mb-3">{t('verificationPending')}</h1>
          <p className="text-stone-500 leading-relaxed">{t('verificationMessage')}</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary w-full"
        >
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

export default VerificationPending
