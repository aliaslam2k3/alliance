import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['var(--font-inter)', 'ui-sans-serif', 'system-ui'],
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        brand: {
          cream: '#F6F3ED',
          blue: '#C2CBD3',
          navy: '#313851',
          yellow: '#e6c200',
          black: '#0a0a0a',
          dark: '#1a1a1a'
        }
      },
      animation: {
        'marquee': 'marquee 28s linear infinite',
      },
      keyframes: {
        marquee: {
          'from': { transform: 'translateX(0)' },
          'to': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
