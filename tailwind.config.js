/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandGreen: "#00ff00",
        darkBg: "#0B0E14",
        cardBg: "#121824",
      }
    },
  },
  plugins: [],
}
