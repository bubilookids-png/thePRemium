/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
      },
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FAF5EC',
          200: '#F3E9D8',
        },
        lavender: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          500: '#8B5CF6',
          700: '#6D28D9',
        },
        skysoft: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          600: '#0284C7',
        },
        blush: {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          500: '#EC4899',
          600: '#DB2777',
        },
        ink: {
          900: '#1E2433',
          700: '#334155',
          500: '#64748B',
        }
      },
      boxShadow: {
        soft: '0 8px 30px rgba(0,0,0,0.25)',
        editorial: '5px 5px 0px #1E2433',
        'editorial-lg': '8px 8px 0px #1E2433',
        'editorial-sm': '3px 3px 0px #1E2433',
      }
    }
  },
  plugins: []
};
