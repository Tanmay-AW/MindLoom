/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#2E86AB',   // Deep Ocean Blue
        'brand-navy': '#457B9D',     // The Correct Navy for Footer/Icons
        'background': '#FAF9F6',     // Off-White
        'primary-text': '#2E2E2E',    // Charcoal Gray
        'accent-green': '#9CAF88',    // Sage Green
        'cta-orange': '#C65D07',     // Terracotta
        'border-gray': '#D3D3D3',     // Soft Gray
      }
    },
  },
  plugins: [],
}
