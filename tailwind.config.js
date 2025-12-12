/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // We map standard Tailwind colors to your theme names for better gradients
        'deep-gold': '#B45309', 
        'gold-light': '#F59E0B',
        'dark-brown': '#292524',
        'warm-parchment': '#FAFAF9', // Stone-50 equivalent
        'liturgical-red': '#B91C1C',
        'emerald-green': '#15803D',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Noto Serif Ethiopic', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 4px 14px 0 rgba(180, 83, 9, 0.39)', // Gold glow
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
        'subtle-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23b45309' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
