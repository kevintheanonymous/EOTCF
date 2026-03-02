import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    // Load saved language from localStorage or default to 'en'
    if (typeof window !== 'undefined') {
      return localStorage.getItem('eotc-language') || 'en'
    }
    return 'en'
  })

  const setLanguage = (lang) => {
    setLanguageState(lang)
    localStorage.setItem('eotc-language', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

