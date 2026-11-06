/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bombero-primary': '#CE2029',
        'bombero-primary-hover': '#B01820',
        'bombero-primary-light': '#FDF2F2',
        'bombero-primary-border': '#FCA5A5',
        'bombero-secondary': '#7A1E24',
        'bombero-secondary-hover': '#5C151A',
        'bombero-secondary-light': '#FBF0F1',
        'bombero-warning': '#FEB000',
        'bombero-warning-dark': '#B45309',
        'bombero-warning-light': '#FEF3C7',
        'bombero-warning-border': '#FDE68A',
        'bombero-dark': '#1A1A1A',
        'bombero-dark-surface': '#262626',
        'bombero-bone': '#F5F2EA',
        'bombero-bg': '#F8FAFC',
        'bombero-surface': '#FFFFFF',
        'bombero-border': '#E2E8F0',
        'bombero-border-dark': '#CBD5E1',
        'bombero-text-primary': '#0F172A',
        'bombero-text-secondary': '#475569',
        'bombero-text-muted': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SF Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'btn': '4px',
        'card': '6px',
      }
    },
  },
  plugins: [],
}
