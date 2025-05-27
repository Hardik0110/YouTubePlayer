/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0F0F0F',
        secondary: '#232D3F',
        accent: '#005B41',
        background: '#008170',
        textColor: '#0F0F0F',
        button: {
          base: '#0F0F0F',
          text: '#008170',
          highlight: '#005B41',
          hover: 'rgba(0, 91, 65, 0.3)',
          active: 'rgba(91, 0, 0, 0.25)'
        },
        category: {
          text: '#FFFFFF',      
          base: '#0F0F0F',
          light: '#008170',
          accent: '#232D3F',
          active: {
            base: '#232D3F',
            light: '#008170',
            accent: '#0F0F0F'
          }
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #0F0F0F, #232D3F)',
        'gradient-accent': 'linear-gradient(to right, #232D3F, #005B41)',
        'gradient-rainbow': 'linear-gradient(45deg, #0F0F0F, #232D3F, #005B41, #008170)'
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'vt323': ['"VT323"', 'monospace']
      },
      keyframes: {
        dots: {
          '0%': { backgroundPosition: '0 0, 4px 4px' },
          '100%': { backgroundPosition: '8px 0, 12px 4px' }
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        dots: 'dots 0.5s infinite linear'
      },
      boxShadow: {
        retro: '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'retro-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)'
      },
      borderWidth: {
        '3': '3px'
      },
      scale: {
        '102': '1.02'
      }
    }
  },
  plugins: []
}
