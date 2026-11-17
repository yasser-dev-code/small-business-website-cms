/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fbf7f0',
          100: '#f3e9d8',
          200: '#e5d0ae',
          300: '#d3b183',
          400: '#c1925c',
          500: '#b07c45',
          600: '#96643a',
          700: '#7a4e31',
          800: '#65412d',
          900: '#553728'
        },
        ink: {
          800: '#26211c',
          900: '#1a1613'
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out both'
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  },
  plugins: []
};
