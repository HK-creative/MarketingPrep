/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent': '#00BFA6',
      },
      backdropBlur: {
        'glass': '14px',
      },
      borderRadius: {
        'glass': '16px',
      },
      fontFamily: {
        'sans': ['Inter', 'Alef', 'system-ui', 'sans-serif'],
      },
      animation: {
        'confetti': 'confetti 0.5s ease-out forwards',
        'flip': 'flip 0.6s ease-in-out',
        'shake': 'shake 0.5s ease-in-out',
        'slideInUp': 'slideInUp 0.4s ease-out',
        'slideInDown': 'slideInDown 0.4s ease-out',
        'slideInLeft': 'slideInLeft 0.4s ease-out',
        'slideInRight': 'slideInRight 0.4s ease-out',
        'fadeIn': 'fadeIn 0.3s ease-in',
        'fadeInUp': 'fadeInUp 0.5s ease-out',
        'scaleIn': 'scaleIn 0.3s ease-out',
        'bounce-subtle': 'bounce-subtle 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'typing': 'typing 3.5s steps(40, end), blink 0.75s step-end infinite',
      },
      keyframes: {
        confetti: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(-100vh) rotate(720deg)', opacity: '0' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-10px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(10px)' },
        },
        slideInUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translateY(0)' },
          '40%, 43%': { transform: 'translateY(-8px)' },
          '70%': { transform: 'translateY(-4px)' },
          '90%': { transform: 'translateY(-2px)' },
        },
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(0, 191, 166, 0.3)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(0, 191, 166, 0.6)',
            transform: 'scale(1.02)'
          },
        },
        typing: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 50%': { borderColor: 'transparent' },
          '51%, 100%': { borderColor: '#00BFA6' },
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
    },
  },
  plugins: [],
} 