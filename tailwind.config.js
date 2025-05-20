/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#041562',   // midnight blue
        secondary: '#11468F', // deep ocean blue
        accent: '#DA1212',    // vivid red
        background: '#000000',// light gray
        textColor: '#11468F', // deep ocean blue
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #041562, #11468F)',
        'gradient-accent':  'linear-gradient(to right, #DA1212,rgb(0, 0, 0))',
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
