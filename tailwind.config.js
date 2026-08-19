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
        magenta: '#B600A8',
        violet: '#7621B0',
        ember: '#BE4C00',
      },
      fontFamily: {
        sans: ['Kanit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
