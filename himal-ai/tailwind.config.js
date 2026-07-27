/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background-dark': '#0A0D14',
        'surface-glass': 'rgba(255, 255, 255, 0.03)',
        'surface-glass-hover': 'rgba(255, 255, 255, 0.08)',
        'accent-rhododendron': '#E33A4D',
        'accent-temple-gold': '#D4AF37',
        'text-primary': '#F8F9FA',
        'text-secondary': '#A0AAB2',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-aurora': 'radial-gradient(at 0% 0%, hsla(353, 74%, 55%, 0.1) 0px, transparent 50%), radial-gradient(at 100% 100%, hsla(43, 65%, 52%, 0.1) 0px, transparent 50%)',
      }
    },
  },
  plugins: [],
}