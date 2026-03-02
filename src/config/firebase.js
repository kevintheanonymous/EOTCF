import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'

// Firebase configuration - Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyC482JiNDD5L0HJTq0ySqZjSPygG68OScs",
  authDomain: "eotc-b43ba.firebaseapp.com",
  projectId: "eotc-b43ba",
  storageBucket: "eotc-b43ba.firebasestorage.app",
  messagingSenderId: "77557273186",
  appId: "1:77557273186:web:143bc82aa4c7bd663d373b",
  measurementId: "G-9E5TZ26CL4"
};

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

// Enable offline persistence for mobile-first experience
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open - persistence only works in one tab
    console.warn('Firestore persistence failed: Multiple tabs open')
  } else if (err.code === 'unimplemented') {
    // Browser doesn't support persistence
    console.warn('Firestore persistence not available in this browser')
  }
})

