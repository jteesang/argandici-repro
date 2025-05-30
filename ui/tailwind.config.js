/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'argan-gold': '#c9a145',
        'argan-dark': '#3c2f1d',
        'argan-light': '#f8f5e9',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Raleway', 'sans-serif'],
      },
      spacing: {
        'section': '5rem',
        'section-lg': '8rem',
        'faq-gap': '2.5rem',
      },
      maxHeight: {
        '0': '0',
        '96': '24rem',
      },
      opacity: {
        '0': '0',
        '100': '1',
      },
      transitionProperty: {
        'height': 'height',
        'max-height': 'max-height',
        'opacity': 'opacity',
      }
    },
  },
  plugins: [],
}
