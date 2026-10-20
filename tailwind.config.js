/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0E1A',
        surface: '#0F1524',
        'surface-elevated': '#141C2E',
        accent: '#00D4FF',
        'accent-soft': '#7DD3FC',
        success: '#10B981',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      boxShadow: {
        'glow': '0 0 35px rgba(0, 212, 255, 0.18)',
        'glow-sm': '0 0 20px rgba(0, 212, 255, 0.12)',
      },
    },
  },
  plugins: [],
};
