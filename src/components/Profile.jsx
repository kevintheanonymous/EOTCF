import React, { useState, useEffect } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getTranslation } from '../utils/translations'

const Profile = () => {
  const { currentUser, userRole } = useAuth()
  const { language } = useLanguage()
  const t = (key) => getTranslation(language, key)

  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    role: ''
  })

  // Custom EOTC Cross for the Header
  const EOTCCross = () => (
    <svg className="w-12 h-12 text-deep-gold mb-4" viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C10.9 2 10 2.9 10 4V8H6C4.9 8 4 8.9 4 10V14C4 15.1 4.9 16 6 16H10V20C10 21.1 10.9 22 12 22C13.1 22 14 21.1 14 20V16H18C19.1 16 20 15.1 20 14V10C20 8.9 19.1 8 18 8H14V4C14 2.9 13.1 2 12 2ZM12 4V8V4ZM6 10H10H6ZM14 10H18H14ZM10 14V16V14ZM14 14V16V14ZM12 16V20V16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
       <path d="M12 5L12 7M17 12L19 12M12 17L12 19M5 12L7 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  )

  useEffect(() => {
    fetchUserData()
  }, [currentUser])

  const fetchUserData = async () => {
    if (!currentUser) return
    try {
      const docRef = doc(db, 'users', currentUser.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setUserData(docSnap.data())
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const docRef = doc(db, 'users', currentUser.uid)
      await updateDoc(docRef, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber
      })
      setIsEditing(false)
    } catch (error) {
      alert('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center py-10 text-deep-gold animate-pulse">Loading Profile...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex justify-center">
            <EOTCCross />
        </div>
        <h1 className="text-3xl font-serif font-bold text-dark-brown">{t('profile') || 'My Profile'}</h1>
        <p className="text-stone-500">Manage your personal information</p>
      </div>

      <div className="card bg-white shadow-soft rounded-2xl p-8 border border-stone-100">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('firstName')}</label>
              <input 
                type="text" 
                value={userData.firstName} 
                onChange={e => setUserData({...userData, firstName: e.target.value})}
                disabled={!isEditing}
                className={`input-field ${!isEditing && 'bg-stone-50 text-stone-500 border-transparent'}`}
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('lastName')}</label>
              <input 
                type="text" 
                value={userData.lastName} 
                onChange={e => setUserData({...userData, lastName: e.target.value})}
                disabled={!isEditing}
                className={`input-field ${!isEditing && 'bg-stone-50 text-stone-500 border-transparent'}`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('email')}</label>
            <input 
              type="email" 
              value={userData.email} 
              disabled={true} // Email cannot be changed easily
              className="input-field bg-stone-50 text-stone-500 border-transparent cursor-not-allowed opacity-75"
            />
            <p className="text-xs text-stone-400 mt-1">To change your email, please contact an administrator.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('phoneNumber')}</label>
            <input 
              type="tel" 
              value={userData.phoneNumber} 
              onChange={e => setUserData({...userData, phoneNumber: e.target.value})}
              disabled={!isEditing}
              className={`input-field ${!isEditing && 'bg-stone-50 text-stone-500 border-transparent'}`}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">{t('role')}</label>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                userData.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                userData.role === 'treasurer' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
            }`}>
                {userData.role}
            </span>
          </div>

          <div className="pt-6 border-t border-stone-100 flex gap-4">
            {isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary flex-1">
                  Save Changes
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setIsEditing(true)} className="btn-primary w-full">
                Edit Profile
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  )
}

export default Profile
