import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand palette từ prototype LongAnhCorp
        navy: {
          50: '#eef4fb',
          100: '#d4e3f3',
          200: '#a8c5e6',
          300: '#7ba6d9',
          400: '#3f72b6',
          500: '#1d5499',
          600: '#0F3D7A', // primary navy
          700: '#0c3263',
          800: '#0a2952',
          900: '#081f3f',
        },
        brand: {
          50: '#fef6ed',
          100: '#fde7d0',
          200: '#fbcfa0',
          300: '#f8af65',
          400: '#f5953e',
          500: '#F08023', // primary orange
          600: '#dc6612',
          700: '#b34d10',
          800: '#8c3c10',
          900: '#73320f',
        },
        ink: {
          DEFAULT: '#0E1726',
          muted: '#5b6573',
          subtle: '#94a3b8',
        },
        canvas: '#FAFBFD',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.025em',
        eyebrow: '0.16em',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          lg: '2rem',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
