/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        'fade-in': { '0%': { opacity: 0, transform: 'translateY(-0.5rem)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        'fade-in': 'fade-in .35s ease-out forwards',
      },
      colors: {
        'blue-gray50': '#F8FAFC', // dùng trong input
        'base-02': '#0F172A',      // text đậm (Slate-900)
        'basewhite': '#FFFFFF',
      },
    },
  },
  corePlugins: { preflight: false }, 
  plugins: [],
};
