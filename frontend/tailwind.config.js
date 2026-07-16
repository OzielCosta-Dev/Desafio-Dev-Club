/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'devclub-black': '#0a0a0a',
        'devclub-dark': '#121212',
        'devclub-card': '#161616',
        'devclub-green': '#00e676',
        'devclub-green-dark': '#00c264',
      },
      boxShadow: {
        'neon': '0 0 15px rgba(0, 230, 118, 0.35)',
        'neon-lg': '0 0 30px rgba(0, 230, 118, 0.25)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}