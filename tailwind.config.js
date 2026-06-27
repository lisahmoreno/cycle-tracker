/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'diary-bg': '#f5f0e8',
        'diary-accent': '#e8ddd0',
      }
    },
  },
  plugins: [],
}
