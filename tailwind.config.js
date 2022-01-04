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
        teal: colors.teal
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
    // TODO: make this work to render header bar on ff properly
    // plugin(function ({ addVariant, e, postcss }) {
  	//   addVariant('firefox', ({ container, separator }) => {
    // 		const isFirefoxRule = postcss.atRule({
    // 		  name: '-moz-document',
    // 		  params: 'url-prefix()',
    // 		});
    // 		isFirefoxRule.append(container.nodes);
    // 		container.append(isFirefoxRule);
    // 		isFirefoxRule.walkRules((rule) => {
    // 		  rule.selector = `.${e(
    // 			`firefox${separator}${rule.selector.slice(1)}`
    // 		  )}`;
    // 		});
  	//   });
  	// }),
  ]
}
