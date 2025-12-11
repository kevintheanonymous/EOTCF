import React from 'react'
import { useLanguage } from '../context/LanguageContext'

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage()

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value)}
      className="px-3 py-2 rounded-lg border border-deep-gold bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-deep-gold"
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="am">አማርኛ</option>
    </select>
  )
}

export default LanguageSelector

