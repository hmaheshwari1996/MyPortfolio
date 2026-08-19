/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0C0C0C',
        bone: '#D7E2EA',
        steel: '#646973',
        mist: '#BBCCD7',
        signal: '#12A594',
        'signal-deep': '#0E8F94',
        'signal-bright': '#16BFC4',
        warm: '#E0A33E',
      },
      fontFamily: {
        sans: ['Kanit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
