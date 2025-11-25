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
        background: '#FFFFFF',
        foreground: '#1a1a1a',
      },
      fontFamily: {
        'season-mix': ['var(--font-season-mix)'],
        'season-sans': ['var(--font-season-sans)'],
      },
    },
  },
  plugins: [],
};
export default config;

