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
        'roboto': ['var(--font-roboto)', 'Roboto', 'Roboto Fallback', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;

