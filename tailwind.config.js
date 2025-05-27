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
        button: {
          base: '#292524',    // stone-800
          text: '#DA1212',    // stone-50
          highlight: '#facc15',// yellow-400
          hover: 'rgba(255, 255, 255, 0.3)',
          active: 'rgba(255, 255, 255, 0.25)'
        },
        category: {
          schemes: {
            1: { 
              base: '#041562',    // primary
              light: '#DA1212',   // changed to red
              accent: '#DA1212'   // accent
            },
            2: { 
              base: '#11468F',    // secondary
              light: '#DA1212',   // changed to red
              accent: '#DA1212'   // accent
            },
            3: { 
              base: '#DA1212',    // accent
              light: '#DA1212',   // changed to red
              accent: '#041562'   // primary
            },
            4: { 
              base: '#292524',    // button base
              light: '#DA1212',   // changed to red
              accent: '#DA1212'   // accent
            }
          },
          active: {
            base: '#DA1212',      // accent
            light: '#DA1212',     // changed to red
            accent: '#041562'     // primary
          }
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, #041562, #11468F)',
        'gradient-accent':  'linear-gradient(to right, #DA1212,rgb(0, 0, 0))',
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
    },
  },
  plugins: [],
};
