/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Pretendard Variable"', 'Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      screens: {
        rail: '900px',
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'spin-fast': {
          to: { transform: 'rotate(360deg)' },
        },
        'pulse-step': {
          '0%, 100%': { opacity: '.35' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        rise: 'rise .3s ease both',
        'rise-slow': 'rise .45s cubic-bezier(.2,.8,.2,1) both',
        'spin-fast': 'spin-fast .8s linear infinite',
        'pulse-step': 'pulse-step 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
