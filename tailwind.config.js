/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Amber → Lime-Green skin override
        'amber-300': '#E8FF6B',
        'amber-400': '#D1FF26',
        'amber-500': '#C1ED00',
        'amber-600': '#A8D100',
        // Surface scale
        'gray-900':  '#0C0E11',
        'gray-800':  '#171A1D',
        'gray-700':  '#1D2024',
        'gray-600':  '#23262A',
      },
      fontFamily: {
        headline: ['Lexend', 'sans-serif'],
        body:     ['Manrope', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

