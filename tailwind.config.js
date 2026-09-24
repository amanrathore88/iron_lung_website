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
        },
        border: "hsl(var(--border, 40 10% 84%))",
        input: "hsl(var(--input, 40 10% 84%))",
        ring: "hsl(var(--ring, 25 100% 50%))",
        background: "hsl(var(--background, 40 18% 97%))",
        foreground: "hsl(var(--foreground, 240 6% 12%))",
        primary: {
          DEFAULT: "hsl(var(--primary, 25 100% 50%))",
          foreground: "hsl(var(--primary-foreground, 0 0% 100%))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary, 40 12% 91%))",
          foreground: "hsl(var(--secondary-foreground, 240 6% 12%))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted, 40 10% 88%))",
          foreground: "hsl(var(--muted-foreground, 240 4% 40%))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent, 25 100% 50%))",
          foreground: "hsl(var(--accent-foreground, 0 0% 100%))",
        },
        card: {
          DEFAULT: "hsl(var(--card, 40 14% 93%))",
          foreground: "hsl(var(--card-foreground, 240 6% 12%))",
        },
        steel: "hsl(var(--steel, 40 10% 80%))",
        darkGrey: "#1C1C1F",
        cardBg: "#F1EFE9",
        ironOrange: {
          DEFAULT: "#ff6900",
          glow: "rgba(255, 105, 0, 0.45)",
          border: "#ff6900",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        manrope: ['"Manrope"', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        space: ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        body: ["Geist", "sans-serif"],
      },
      boxShadow: {
        'orange-glow': '0 0 25px rgba(255, 94, 30, 0.45)',
        'cyan-glow': '0 0 20px rgba(0, 210, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'card-glow': '0 0 16px 0 rgba(255, 105, 0, 0.12)',
        'soft-depth': '0 8px 30px rgba(0, 0, 0, 0.05)',
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
