module.exports = {
  content: [
    "./pages/*.{html,js}",
    "./index.html",
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./components/**/*.{html,js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors - Electric Cyan
        primary: {
          DEFAULT: "#00FFFF", // cyan-400
          50: "#ECFEFF", // cyan-50
          100: "#CFFAFE", // cyan-100
          200: "#A5F3FC", // cyan-200
          300: "#67E8F9", // cyan-300
          400: "#22D3EE", // cyan-400
          500: "#06B6D4", // cyan-500
          600: "#0891B2", // cyan-600
          700: "#0E7490", // cyan-700
          800: "#155E75", // cyan-800
          900: "#164E63", // cyan-900
        },
        // Secondary Colors - Vibrant Magenta
        secondary: {
          DEFAULT: "#FF00FF", // fuchsia-500
          50: "#FDF4FF", // fuchsia-50
          100: "#FAE8FF", // fuchsia-100
          200: "#F5D0FE", // fuchsia-200
          300: "#F0ABFC", // fuchsia-300
          400: "#E879F9", // fuchsia-400
          500: "#D946EF", // fuchsia-500
          600: "#C026D3", // fuchsia-600
          700: "#A21CAF", // fuchsia-700
          800: "#86198F", // fuchsia-800
          900: "#701A75", // fuchsia-900
        },
        // Accent Colors - Pure Yellow
        accent: {
          DEFAULT: "#FFFF00", // yellow-400
          50: "#FEFCE8", // yellow-50
          100: "#FEF9C3", // yellow-100
          200: "#FEF08A", // yellow-200
          300: "#FDE047", // yellow-300
          400: "#FACC15", // yellow-400
          500: "#EAB308", // yellow-500
          600: "#CA8A04", // yellow-600
          700: "#A16207", // yellow-700
          800: "#854D0E", // yellow-800
          900: "#713F12", // yellow-900
        },
        // Background Colors
        background: "#0A0A1A", // slate-900
        surface: "#1A1A2E", // slate-800
        // Text Colors
        text: {
          primary: "#FFFFFF", // white
          secondary: "#B0B0C0", // slate-400
        },
        // Status Colors
        success: "#00FF88", // emerald-400
        warning: "#FF8800", // orange-500
        error: "#FF3366", // rose-500
      },
      fontFamily: {
        // Headings - Futuristic space aesthetic
        heading: ['Orbitron', 'sans-serif'],
        orbitron: ['Orbitron', 'sans-serif'],
        // Body - Modern sans-serif with tech character
        body: ['Exo 2', 'sans-serif'],
        exo: ['Exo 2', 'sans-serif'],
        // Captions - Condensed for UI labels
        caption: ['Rajdhani', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        // Data - Monospace for scores and numbers
        data: ['JetBrains Mono', 'monospace'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        // Fluid typography using clamp
        'fluid-xs': 'clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)',
        'fluid-sm': 'clamp(0.875rem, 0.8rem + 0.375vw, 1rem)',
        'fluid-base': 'clamp(1rem, 0.9rem + 0.5vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 1rem + 0.625vw, 1.25rem)',
        'fluid-xl': 'clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)',
        'fluid-2xl': 'clamp(1.5rem, 1.3rem + 1vw, 1.875rem)',
        'fluid-3xl': 'clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem)',
        'fluid-4xl': 'clamp(2.25rem, 1.9rem + 1.75vw, 3rem)',
      },
      boxShadow: {
        // Standard shadows
        'game-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'game-base': '0 2px 8px rgba(0, 0, 0, 0.4)',
        'game-md': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'game-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'game-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // Neon glows
        'neon-primary': '0 0 20px #00FFFF',
        'neon-secondary': '0 0 20px #FF00FF',
        'neon-accent': '0 0 20px #FFFF00',
        'neon-success': '0 0 20px #00FF88',
        'neon-warning': '0 0 20px #FF8800',
        'neon-error': '0 0 20px #FF3366',
        // Combined shadows
        'neon-primary-strong': '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px #00FFFF',
        'neon-secondary-strong': '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px #FF00FF',
        'neon-accent-strong': '0 2px 8px rgba(0, 0, 0, 0.4), 0 0 20px #FFFF00',
      },
      textShadow: {
        'glow': '0 0 10px currentColor',
        'glow-strong': '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        'neon-primary': '0 0 10px #00FFFF, 0 0 20px #00FFFF',
        'neon-secondary': '0 0 10px #FF00FF, 0 0 20px #FF00FF',
        'neon-accent': '0 0 10px #FFFF00, 0 0 20px #FFFF00',
      },
      animation: {
        'parallax-slow': 'parallax-move 30s linear infinite',
        'parallax-medium': 'parallax-move 20s linear infinite',
        'parallax-fast': 'parallax-move 10s linear infinite',
        'power-up-pulse': 'power-up-pulse 2s ease-in-out infinite alternate',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite alternate',
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'slide-up': 'slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'scale-in': 'scale-in 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards',
      },
      keyframes: {
        'parallax-move': {
          '0%': { transform: 'translateY(0px)' },
          '100%': { transform: 'translateY(-100px)' },
        },
        'power-up-pulse': {
          '0%': { 
            boxShadow: '0 0 20px currentColor',
            transform: 'scale(1)',
          },
          '100%': { 
            boxShadow: '0 0 40px currentColor, 0 0 60px currentColor',
            transform: 'scale(1.05)',
          },
        },
        'neon-pulse': {
          '0%': { 
            textShadow: '0 0 10px currentColor',
          },
          '100%': { 
            textShadow: '0 0 20px currentColor, 0 0 30px currentColor',
          },
        },
        'fade-in': {
          'from': { 
            opacity: '0',
            transform: 'translateY(10px)',
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-up': {
          'from': { 
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          'from': { 
            opacity: '0',
            transform: 'scale(0.9)',
          },
          'to': { 
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
      transitionDuration: {
        '50': '50ms',
        '250': '250ms',
      },
      transitionTimingFunction: {
        'game': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      backdropBlur: {
        'game': '8px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'game': '0.75rem',
        'game-lg': '1rem',
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-shadow-glow': {
          textShadow: '0 0 10px currentColor',
        },
        '.text-shadow-glow-strong': {
          textShadow: '0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor',
        },
        '.bg-gradient-cosmic': {
          background: 'linear-gradient(135deg, #0A0A1A 0%, #1A1A2E 100%)',
        },
        '.bg-gradient-neon': {
          background: 'linear-gradient(135deg, #00FFFF 0%, #FF00FF 100%)',
        },
        '.backdrop-game': {
          backdropFilter: 'blur(8px) saturate(180%)',
          backgroundColor: 'rgba(26, 26, 46, 0.8)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}