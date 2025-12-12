import { GoogleGenerativeAI } from '@google/generative-ai'

// Access the key securely from Vercel environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error("Error: Gemini API Key is missing. Check Vercel Environment Variables.")
}

export const genAI = new GoogleGenerativeAI(API_KEY)
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
