import React from 'react'
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

  return (
    <div className="min-h-screen bg-warm-parchment flex">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-72 bg-white border-r border-stone-200 z-20 hidden lg:flex flex-col no-print">
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 text-deep-gold">
            <div className="p-2 bg-amber-50 rounded-lg">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <h1 className="text-xl font-serif font-bold text-dark-brown">EOTC Toulouse</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            if (!canAccess(item.roles)) return null
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive ? 'bg-gold-gradient text-white shadow-glow' : 'text-stone-500 hover:bg-stone-50 hover:text-deep-gold'}`}>
                <svg className={`w-5 h-5 ${isActive ? 'text-white' : 'text-stone-400 group-hover:text-deep-gold'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-stone-100">
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

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 p-6 lg:p-10 w-full max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}

export default Layout
