/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#00D4FF',
        secondary: '#7B61FF',
        background: {
          dark: '#1E1E2F',
          darker: '#2A2A3D',
          light: '#F8FAFC',
          lighter: '#FFFFFF',
        },
        status: {
          available: '#32CD32',
          occupied: '#FF5555',
          reserved: '#FFAA33',
        },
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 10px theme(colors.primary)',
        'neon-purple': '0 0 10px theme(colors.secondary)',
      },
    },
  },
  plugins: [],
};