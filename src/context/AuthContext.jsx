import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
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
        
        // 1. Fetch user data immediately
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          let role = userSnap.data().role
          
          // Auto-fix: If this is the main admin but role is wrong, fix it now
          if (user.email === ADMIN_EMAIL && role !== 'admin') {
             await setDoc(userRef, { role: 'admin' }, { merge: true })
             role = 'admin'
          }
          setUserRole(role)
        } else {
          // 2. No profile exists yet? Create one.
          if (user.email === ADMIN_EMAIL) {
            // Create Admin Profile
            await setDoc(userRef, {
              email: user.email,
              firstName: 'Admin',
              lastName: 'User',
              role: 'admin',
              createdAt: new Date()
            })
            setUserRole('admin')
          } else {
            // Create Pending Profile for everyone else
            await setDoc(userRef, {
                email: user.email,
                role: 'pending',
                createdAt: new Date()
            })
            setUserRole('pending')
          }
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
      
      // Setup the user document
      const role = email === ADMIN_EMAIL ? 'admin' : 'pending'
      
      await setDoc(doc(db, 'users', user.uid), {
        ...userData,
        email,
        role: role,
        createdAt: new Date()
      })
      
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

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
