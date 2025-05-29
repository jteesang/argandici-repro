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
      animation: {
        marquee: 'marquee var(--marquee-duration) linear infinite',
      }
    },
  },
  plugins: [],
}
