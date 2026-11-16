import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        'card-hover': '#F1F5F9',
        accent: '#2563EB',
        'accent-hover': '#1D4ED8',
        border: '#E2E8F0',
        muted: '#64748B',
        'muted-light': '#475569',
        surface: '#F1F5F9',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-glow': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(37,99,235,0.06), transparent)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      boxShadow: {
        'card': '0 4px 24px rgba(15,23,42,0.04)',
        'card-hover': '0 8px 40px rgba(15,23,42,0.08)',
        'accent': '0 0 30px rgba(37,99,235,0.12)',
        'accent-sm': '0 0 15px rgba(37,99,235,0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
