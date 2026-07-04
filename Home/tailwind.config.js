/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#0d1b2a",
        navycard: "#112438", // Adjust to your preferred hex
        cyan: "#00b4d8",
        blueacc: "#1d4ed8"   // Adjust to your preferred hex
      },
      fontFamily: {
        display: ['"Your Custom Font"', 'sans-serif'], 
      }
    },
  },
  plugins: [],
}