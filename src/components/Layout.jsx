import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const Layout = ({ children }) => {
  const { userRole, logout, isOnline } = useAuth()
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

  // Navigation items with mobile-optimized icons
  const navItems = [
    { path: '/dashboard', label: t('dashboard'), icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", roles: ['admin', 'treasurer', 'member'], showInBottomNav: true },
    { path: '/transactions', label: t('transactions'), icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", roles: ['admin', 'treasurer'], showInBottomNav: true },
    { path: '/inventory', label: t('inventory'), icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", roles: ['admin', 'treasurer', 'member'], showInBottomNav: true },
    { path: '/users', label: t('users'), icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", roles: ['admin'], showInBottomNav: false },
    { path: '/profile', label: t('profile'), icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z", roles: ['admin', 'treasurer', 'member'], showInBottomNav: true }
  ]

  // Get items for bottom navigation (max 5 for mobile)
  const bottomNavItems = navItems.filter(item => canAccess(item.roles) && item.showInBottomNav).slice(0, 4)

  // Custom Ethiopian Cross SVG - More ornate version
  const EOTCCross = ({ className = "w-8 h-8" }) => (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5 L55 25 L75 20 L65 30 L85 35 L65 40 L75 60 L55 50 L60 70 L50 55 L40 70 L45 50 L25 60 L35 40 L15 35 L35 30 L25 20 L45 25 Z" />
      <path d="M50 30 L55 45 L70 40 L55 50 L70 60 L55 55 L50 70 L45 55 L30 60 L45 50 L30 40 L45 45 Z" opacity="0.7" />
      <circle cx="50" cy="50" r="8" />
      <circle cx="50" cy="20" r="4" />
      <circle cx="50" cy="80" r="4" />
      <circle cx="20" cy="50" r="4" />
      <circle cx="80" cy="50" r="4" />
    </svg>
  )

  return (
    <div className="min-h-screen bg-warm-parchment flex flex-col lg:flex-row">
      
      {/* OFFLINE INDICATOR BANNER */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white text-center py-2 text-sm font-medium z-50 flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
          {t('offlineMode')}
        </div>
      )}

      {/* MOBILE HEADER */}
      <div className={`lg:hidden bg-white border-b border-stone-200 p-4 sticky ${!isOnline ? 'top-8' : 'top-0'} z-30 flex justify-between items-center shadow-sm`}>
        <div className="flex items-center gap-2 text-deep-gold">
          <EOTCCross className="w-7 h-7" />
          <span className="font-serif font-bold text-dark-brown">EOTC Toulouse</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors active:scale-95"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </div>

      {/* MOBILE MENU OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR - Desktop & Expanded Mobile */}
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
        
        <nav className="flex-1 px-4 space-y-2 mt-4 lg:mt-4 pt-4 lg:pt-0 overflow-y-auto">
          {navItems.map((item) => {
            if (!canAccess(item.roles)) return null
            const isActive = location.pathname === item.path
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsMobileMenuOpen(false)} 
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
          
          <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm active:scale-95">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            {t('logout')}
          </button>
        </div>
      </div>

      {/* MAIN CONTENT - With bottom padding for mobile nav */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-10 pb-24 lg:pb-10 overflow-x-hidden">
        {children}
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-[64px] rounded-lg transition-all active:scale-95 ${
                  isActive 
                    ? 'text-deep-gold' 
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-amber-100' : ''}`}>
                  <svg 
                    className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                    strokeWidth={isActive ? 2.5 : 2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <span className={`text-xs mt-0.5 font-medium ${isActive ? 'text-deep-gold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
          
          {/* More menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center py-2 px-3 min-w-[64px] rounded-lg transition-all active:scale-95 text-stone-400 hover:text-stone-600"
          >
            <div className="p-1.5">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </div>
            <span className="text-xs mt-0.5 font-medium">{t('more')}</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

export default Layout
