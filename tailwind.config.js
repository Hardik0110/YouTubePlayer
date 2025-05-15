/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FF6B6B',    // coral pink
        secondary: '#4ECDC4',  // turquoise
        accent: '#FFE66D',     // sunny yellow
        background: '#95E1D3', // mint green
        textColor: '#2C3E50',  // dark blue
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'vt323': ['"VT323"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'retro': '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'retro-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};