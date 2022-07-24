// const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
   './app/**/*.html.erb',
    './app/helpers/**/*.rb',
    './app/javascript/**/*.js',
    './app/javascript/**/*.jsx',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ['Lato	', 'sans-serif'],
    },
    extend: {
      colors: {
        teal: colors.teal,
        orange: colors.orange
      },
      zIndex: {
       '-10': '-10',
      }
    },
  },
  variants: {
    extend: {
      backgroundColor: ['active'],
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ]
}
