/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'deep-gold': '#B45309',
        'dark-brown': '#292524',
        'warm-parchment': '#FAFAF9',
        'liturgical-red': '#B91C1C',
        'emerald-green': '#15803D',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Noto Serif Ethiopic', 'serif'],
      }
    },
  },
  plugins: [],
}