/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': '#074498',
        'brand-secondary': '#cbae37',
        'brand-danger': '#c71216'
      },
      fontFamily: {
        sans: ['Andale Mono','Jost', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

