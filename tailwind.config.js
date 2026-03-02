import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
      },
      boxShadow: {
        'sm': '0 8px 30px rgba(0,0,0,0.04)',
        'md': '0 20px 60px -15px rgba(0,0,0,0.05)',
        'lg': '0 30px 60px -15px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}
