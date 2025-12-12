import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const Layout = ({ children }) => {
  const { userRole, logout } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = (key) => getTranslation(language, key)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const canAccess = (requiredRoles) => requiredRoles.includes(userRole)

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", roles: ['admin', 'treasurer', 'member'] },
    { path: '/transactions', label: t('transactions'), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", roles: ['admin', 'treasurer'] },
    { path: '/inventory', label: t('inventory'), icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", roles: ['admin', 'treasurer', 'member'] },
    { path: '/users', label: t('users'), icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", roles: ['admin'] }
  ]

  // Custom Ethiopian Cross SVG
  const EOTCCross = () => (
    <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C10.9 2 10 2.9 10 4V8H6C4.9 8 4 8.9 4 10V14C4 15.1 4.9 16 6 16H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V16H18C19.1 16 20 15.1 20 14V10C20 8.9 19.1 8 18 8H14V4C14 2.9 13.1 2 12 2ZM12 4V8V4ZM6 10H10H6ZM14 10H18H14ZM10 14V16V14ZM14 14V16V14ZM12 16V20V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 5L12 7M17 12L19 12M12 17L12 19M5 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-warm-parchment flex flex-col lg:flex-row">
      
      {/* MOBILE HEADER (Visible only on small screens) */}
      <div className="lg:hidden bg-white border-b border-stone-200 p-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2 text-deep-gold">
          <EOTCCross />
          <span className="font-serif font-bold text-dark-brown">EOTC Toulouse</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY (Dark background when menu is open) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR (Responsive: Fixed slide-in on mobile, Static on Desktop) */}
      <div className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-stone-200 z-40 flex flex-col shadow-2xl lg:shadow-none
        transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:h-screen lg:inset-auto
      `}>
        <div className="p-8 pb-4 hidden lg:block">
          <div className="flex items-center gap-3 text-deep-gold">
            <div className="p-2 bg-amber-50 rounded-lg">
              <EOTCCross />
            </div>
            <h1 className="text-xl font-serif font-bold text-dark-brown">EOTC Toulouse</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4 lg:mt-4 pt-4 lg:pt-0">
          {navItems.map((item) => {
            if (!canAccess(item.roles)) return null
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-gold-gradient text-white shadow-glow' : 'text-stone-500 hover:bg-stone-50 hover:text-deep-gold'}`}
              >
                <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-deep-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-stone-100 bg-white">
          <div className="bg-stone-50 p-4 rounded-xl mb-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">Language</p>
            <LanguageSelector />
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {t('logout')}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-10 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}

export default Layout
