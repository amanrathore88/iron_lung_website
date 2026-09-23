/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          DEFAULT: '#01090F',
          dark: '#01060A',
          card: 'rgba(6, 18, 28, 0.7)',
          hover: 'rgba(12, 28, 44, 0.85)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
        brand: {
          orange: '#FF5E1E',
          'orange-hover': '#FF7033',
          'orange-glow': 'rgba(255, 94, 30, 0.45)',
          cyan: '#00D2FF',
          'cyan-glow': 'rgba(0, 210, 255, 0.3)',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        manrope: ['"Manrope"', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'orange-glow': '0 0 25px rgba(255, 94, 30, 0.45)',
        'cyan-glow': '0 0 20px rgba(0, 210, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      }
    },
  },
  plugins: [],
}
