/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3A59D1',
        secondary: '#3D90D7',
        accent: '#7AC6D2',
        background: '#B5FCCD',
        textColor: '#2C3E50',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3A59D1, #3D90D7)',
        'gradient-accent':  'linear-gradient(to right, #7AC6D2, #B5FCCD)',
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
        retro: '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'retro-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
