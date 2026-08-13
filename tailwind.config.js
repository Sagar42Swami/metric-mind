/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030712',
          900: '#080c14',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
          primary: '#6366f1', // Indigo
          accent: '#06b6d4',  // Cyan
          success: '#10b981', // Emerald
          warning: '#f59e0b', // Amber
          danger: '#f43f5e',  // Rose
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 2s ease-in-out infinite alternate',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float': 'float 4s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(99, 102, 241, 0.2), 0 0 10px rgba(99, 102, 241, 0.1)' },
          '100%': { boxShadow: '0 0 20px rgba(99, 102, 241, 0.6), 0 0 30px rgba(6, 182, 212, 0.4)' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      },
      boxShadow: {
        'neon-indigo': '0 0 15px rgba(99, 102, 241, 0.3)',
        'neon-cyan': '0 0 15px rgba(6, 182, 212, 0.3)',
        'neon-danger': '0 0 15px rgba(244, 63, 94, 0.4)',
        'neon-success': '0 0 15px rgba(16, 185, 129, 0.3)',
        'glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05), 0 4px 30px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
