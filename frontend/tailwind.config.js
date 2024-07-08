/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    'bg-[url(\'/src/assets/chat-bg.jpg\')]',
  ],
  plugins: [],
}

