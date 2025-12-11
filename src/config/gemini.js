import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API - Replace with your actual API key
const API_KEY = 'YOUR_GEMINI_API_KEY'
export const genAI = new GoogleGenerativeAI(API_KEY)
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

