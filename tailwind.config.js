/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3A0CA3',    // zaffre (main brand color)
        secondary: '#4361EE',  // neon-blue
        accent: '#F72585',     // rose (vibrant accent)
        background: '#000000', // black
        textColor: '#4CC9F0',  // vivid-sky-blue
        button: {
          base: '#7209B7',       // grape
          text: '#4CC9F0',       // vivid-sky-blue
          highlight: '#F72585',   // rose
          hover: 'rgba(76, 201, 240, 0.3)', // vivid-sky-blue with opacity
          active: 'rgba(76, 201, 240, 0.25)'// vivid-sky-blue with opacity
        },
        category: {
          base: '#3A0CA3',    // zaffre
          light: '#4CC9F0',   // vivid-sky-blue
          accent: '#F72585',   // rose
          active: {
            base: '#F72585',    // rose
            light: '#4CC9F0',   // vivid-sky-blue
            accent: '#3A0CA3'   // zaffre
          }
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #3A0CA3, #4361EE)',
        'gradient-accent': 'linear-gradient(to right, #F72585, #4CC9F0)',
        'gradient-rainbow': 'linear-gradient(45deg, #F72585, #B5179E, #7209B7, #560BAD, #480CA8, #3A0CA3, #3F37C9, #4361EE, #4895EF, #4CC9F0)',
      },
      fontFamily: {
        'press-start': ['"Press Start 2P"', 'cursive'],
        'vt323': ['"VT323"', 'monospace'],
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
        'dots': 'dots 0.5s infinite linear'
      },
      boxShadow: {
        retro: '4px 4px 0px rgba(0, 0, 0, 0.2)',
        'retro-lg': '8px 8px 0px rgba(0, 0, 0, 0.2)',
      },
      borderWidth: {
        '3': '3px',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
};