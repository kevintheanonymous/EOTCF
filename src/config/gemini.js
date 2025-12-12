import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini API - Replace with your actual API key
const API_KEY = 'AIzaSyDG174_xkRftKTgWy0Fu1ef8jSmlSxYUuQ'
export const genAI = new GoogleGenerativeAI(API_KEY)
export const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

