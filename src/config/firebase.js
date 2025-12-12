import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

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

