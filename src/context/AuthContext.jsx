import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  reload
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'
import { updateSessionActivity, clearSession, resetLoginAttempts } from '../utils/security'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  const ADMIN_EMAIL = 'eotctoulousefinance@gmail.com' 

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, []) 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        try {
          const userRef = doc(db, 'users', user.uid)
          const userSnap = await getDoc(userRef)
          
          if (userSnap.exists()) {
            let role = userSnap.data().role
            if (user.email === ADMIN_EMAIL && role !== 'admin') {
               await setDoc(userRef, { role: 'admin' }, { merge: true })
               role = 'admin'
            }
            setUserRole(role)
          } else {
            const role = (user.email === ADMIN_EMAIL) ? 'admin' : 'pending';
            await setDoc(userRef, {
              email: user.email,
              role: role,
              createdAt: new Date()
            })
            setUserRole(role)
          }
        } catch (err) {
          console.error("Database Error:", err.message);
        }
      } else {
        setCurrentUser(null)
        setUserRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signup = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const role = email === ADMIN_EMAIL ? 'admin' : 'pending'
      
      // Send email verification
      await sendEmailVerification(user)
      
      await setDoc(doc(db, 'users', user.uid), { 
        ...userData, 
        email, 
        role, 
        emailVerified: false,
        createdAt: new Date() 
      })
      return { success: true, emailSent: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      
      // Reset failed login attempts on success
      resetLoginAttempts()
      
      // Update session activity
      updateSessionActivity()
      
      return { success: true, emailVerified: result.user.emailVerified }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      clearSession()
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Resend email verification
  const resendVerificationEmail = async () => {
    try {
      if (currentUser && !currentUser.emailVerified) {
        await sendEmailVerification(currentUser)
        return { success: true }
      }
      return { success: false, error: 'No user or already verified' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Check email verification status
  const checkEmailVerification = async () => {
    try {
      if (currentUser) {
        await reload(currentUser)
        return currentUser.emailVerified
      }
      return false
    } catch {
      return false
    }
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = { 
    currentUser, 
    userRole, 
    signup, 
    login, 
    logout, 
    resetPassword, 
    resendVerificationEmail,
    checkEmailVerification,
    isOnline,
    loading 
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
