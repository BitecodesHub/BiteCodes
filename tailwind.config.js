/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ✅ Ensures all React files are scanned
    "./public/index.html", // ✅ Ensures Tailwind works in index.html
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
