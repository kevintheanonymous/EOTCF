import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import LanguageSelector from './LanguageSelector'

const Layout = ({ children }) => {
  const { userRole, logout, currentUser } = useAuth()
  const { language } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const t = (key) => getTranslation(language, key)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const canAccess = (requiredRoles) => {
    return requiredRoles.includes(userRole)
  }

  const navItems = [
    { path: '/dashboard', label: t('dashboard'), roles: ['admin', 'treasurer', 'member'] },
    { path: '/transactions', label: t('transactions'), roles: ['admin', 'treasurer'] },
    { path: '/inventory', label: t('inventory'), roles: ['admin', 'treasurer', 'member'] },
    { path: '/users', label: t('users'), roles: ['admin'] }
  ]

  return (
    <div className="min-h-screen bg-warm-parchment">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg no-print">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-serif text-deep-gold">EOTC Toulouse</h1>
        </div>
        
        <nav className="mt-6">
          {navItems.map((item) => {
            if (!canAccess(item.roles)) return null
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-6 py-3 ${
                  location.pathname === item.path
                    ? 'bg-deep-gold text-white'
                    : 'text-dark-brown hover:bg-gray-100'
                } transition-colors`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
          <div className="mb-4">
            <LanguageSelector />
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-liturgical-red text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('logout')}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {children}
      </div>
    </div>
  )
}

export default Layout

