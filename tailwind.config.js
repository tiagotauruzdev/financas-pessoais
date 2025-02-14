/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          600: '#2d3748',
          700: '#1F2937',
          800: '#1a1f2e',
          900: '#111827',
          950: '#0B1121',
        },
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
};