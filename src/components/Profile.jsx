import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'

const Profile = () => {
  const { currentUser, userData, updateUserProfile } = useAuth()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (userData) {
      setFormData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || currentUser?.email || '',
        phoneNumber: userData.phoneNumber || ''
      }))
    }
  }, [userData, currentUser])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })

    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDontMatch') || 'Passwords do not match' })
      return
    }
    
    if (formData.password && formData.password.length < 6) {
        setMessage({ type: 'error', text: t('weakPassword') || 'Password too short' })
        return
    }

    setLoading(true)
    
    // Only send relevant fields
    const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber,
        email: formData.email
    }
    
    if (formData.password) {
        updateData.password = formData.password
    }

    const result = await updateUserProfile(currentUser.uid, updateData)

    if (result.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully!' })
      // Clear password fields
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }))
    } else {
      setMessage({ type: 'error', text: result.error })
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-serif text-deep-gold mb-6">Profile Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-8">
        <div className="mb-6 flex items-center">
            <div className="w-16 h-16 bg-deep-gold rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                {formData.firstName?.[0]}{formData.lastName?.[0]}
            </div>
            <div>
                <h2 className="text-xl font-bold">{formData.firstName} {formData.lastName}</h2>
                <p className="text-gray-500 capitalize">{userData?.role}</p>
            </div>
        </div>
      
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-emerald-green/10 text-emerald-green' : 'bg-liturgical-red/10 text-liturgical-red'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
            />
          </div>
          
          <div className="border-t pt-6 mt-6">
             <h3 className="text-lg font-medium mb-4 text-dark-brown">Change Password</h3>
             <p className="text-sm text-gray-500 mb-4">Leave blank if you don't want to change it.</p>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-brown mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-deep-gold"
                    placeholder="••••••••"
                  />
                </div>
             </div>
          </div>

          <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-deep-gold text-white rounded-lg font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Update Profile'}
              </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
