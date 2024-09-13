/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      order: {
      },
      colors: {
        'brand': '#074498',
        'brand-secondary': '#cbae37',
        'brand-danger': '#c71216'
      },
      fontFamily: {
        sans: ['Open Sans','Jost', 'sans-serif'],
      },
      fontStyle:"nomal",
      fontWeight:{
        thin: '100',
        hairline: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '500',
        extrabold: '600',
        'extra-bold': '800',
        black: '900',
      }
    },
  },
  plugins: [],
  variants: {
    extend: {
      order: ['responsive'], // Đảm bảo các lớp responsive có sẵn
    }
  },
};

