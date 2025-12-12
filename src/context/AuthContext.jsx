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

  // Initialize admin user if needed
  const initializeAdmin = async (user) => {
    // Check for the specific admin email
    if (user.email === 'eotctoulousefinance@gmail.com') {
      const userRef = doc(db, 'users', user.uid)
      const userSnap = await getDoc(userRef)
      
      if (!userSnap.exists()) {
        // Create the admin profile if it doesn't exist
        await setDoc(userRef, {
          email: user.email,
          firstName: 'EOTC',
          lastName: 'Finance Admin',
          phoneNumber: '',
          role: 'admin',
          createdAt: new Date()
        })
        setUserRole('admin')
      } else {
        // Ensure the role is admin if the email matches
        if (userSnap.data().role !== 'admin') {
            await setDoc(userRef, { role: 'admin' }, { merge: true })
        }
        setUserRole('admin')
      }
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        
        // OPTIMIZATION: Fetch user data ONCE
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)
        
        if (userSnap.exists()) {
          let role = userSnap.data().role
          
          // Check if this is the Main Admin needing a role fix
          if (user.email === 'eotctoulouse@gmail.com' && role !== 'admin') {
             await setDoc(userRef, { role: 'admin' }, { merge: true })
             role = 'admin'
          }
          setUserRole(role)
        } else {
          // Document doesn't exist yet
          if (user.email === 'eotctoulouse@gmail.com') {
            // Create Admin Profile immediately
            await setDoc(userRef, {
              email: user.email,
              firstName: 'EOTC',
              lastName: 'Finance Admin',
              role: 'admin',
              createdAt: new Date()
            })
            setUserRole('admin')
          } else {
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
      
      // If signing up as the main admin, initialize as admin immediately
      if (email === 'eotctoulousefinance@gmail.com') {
         await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            email,
            role: 'admin',
            createdAt: new Date()
         })
      } else {
         // Create user document with 'pending' role for everyone else
         await setDoc(doc(db, 'users', user.uid), {
            ...userData,
            email,
            role: 'pending',
            createdAt: new Date()
         })
      }
      
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
