/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10b981", // emerald
        accent: "#f59e0b"   // amber
      }
    },
  },
  plugins: [],
}
