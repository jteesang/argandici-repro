/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37",
        secondary: "#4E3620",
        accent: "#F6E7B3",
        "text-main": "#222",
        success: "#86A26F",
        danger: "#BC3A3A",
        white: "#fff"
      }
    },
  },
  plugins: [],
}
