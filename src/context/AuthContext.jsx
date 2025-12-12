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

  // ⚠️ VERIFY: Is this EXACTLY the email you type when logging in?
  const ADMIN_EMAIL = 'eotctoulousefinance@gmail.com' 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Auth State Changed. User:", user ? user.email : "Logged Out");
      
      if (user) {
        setCurrentUser(user)
        
        try {
          const userRef = doc(db, 'users', user.uid)
          console.log("Checking Database path:", userRef.path); // Should say "users/YOUR_UID"
          
          const userSnap = await getDoc(userRef)
          
          if (userSnap.exists()) {
            const data = userSnap.data();
            console.log("❌ DATABASE SAYS ROLE IS:", data.role); // IF THIS SAYS 'pending', THAT IS THE ISSUE
            
            let role = data.role
            
            // Auto-fixer
            if (user.email === ADMIN_EMAIL && role !== 'admin') {
               console.log("⚠️ Email matches Admin, but role is wrong. Attempting to fix...");
               await setDoc(userRef, { role: 'admin' }, { merge: true })
               role = 'admin'
               console.log("✅ Role auto-corrected to admin");
            }
            setUserRole(role)
          } else {
            console.log("❌ DOCUMENT DOES NOT EXIST in 'users' collection.");
            
            // Create profile if missing
            const role = (user.email === ADMIN_EMAIL) ? 'admin' : 'pending';
            console.log("Creating new profile with role:", role);
            
            await setDoc(userRef, {
              email: user.email,
              role: role,
              createdAt: new Date()
            })
            setUserRole(role)
          }
        } catch (err) {
          console.error("🔥 CRITICAL DATABASE ERROR:", err.message);
          console.error("Check your Firestore Security Rules!");
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

  const value = { currentUser, userRole, signup, login, logout, loading }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
