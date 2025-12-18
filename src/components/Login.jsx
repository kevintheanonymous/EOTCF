import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail // <--- Import this
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc
} from 'firebase/firestore'
import { auth, db } from '../config/firebase'

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

  const ADMIN_EMAIL = 'eotctoulousefinance@gmail.com' 

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
      await setDoc(doc(db, 'users', user.uid), { ...userData, email, role, createdAt: new Date() })
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // --- NEW FUNCTION ---
  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = { currentUser, userRole, signup, login, logout, resetPassword, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
