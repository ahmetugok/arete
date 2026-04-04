/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#f59e0b',
          dark: '#92400e',
        },
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.5)', opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-scale': {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        'alarm-flash': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(224,159,62,0)' },
          '50%': { boxShadow: '0 0 0 16px rgba(224,159,62,0.25)' },
        },
      },
      animation: {
        'gradient-shift': 'gradient-shift 15s ease infinite',
        shimmer: 'shimmer 1.5s infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
        float: 'float 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.5s ease-out forwards',
        'fade-in-scale': 'fade-in-scale 0.3s ease-out forwards',
        'alarm-flash': 'alarm-flash 0.7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
