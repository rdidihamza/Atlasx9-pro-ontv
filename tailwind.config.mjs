/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        bg: '#070710',
        'bg-card': '#0f0f1a',
        'bg-section': '#0a0a14',
        accent: '#3D9BE9',
        gold: '#f59e0b',
        green: '#22c55e',
        orange: '#f97316',
        'text-main': '#f1f5f9',
        'text-muted': '#94a3b8',
        border: '#1e293b',
        danger: '#ef4444',
      },
      boxShadow: {
        'glow-blue': '0 0 20px rgba(61,155,233,0.3)',
        'glow-gold': '0 0 20px rgba(245,158,11,0.3)',
        'glow-green': '0 0 20px rgba(34,197,94,0.3)',
        'glow-orange': '0 0 20px rgba(249,115,22,0.4)',
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
        pulse: 'pulse 2s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
        countUp: 'countUp 0.5s ease-out forwards',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        countUp: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
