import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        poker: {
          green: '#1a4d2e',
          felt: '#0f3d26',
          'light-green': '#2d7a4f',
        },
        casino: {
          'dark-bg': '#0a0a0a',
          'dark-bg-light': '#1a1a1a',
          'felt-dark': '#0a4523',
          'felt-light': '#0d5c2f',
          'gold': '#d4af37',
          'gold-dark': '#b8941f',
          'gold-light': '#f0d35f',
          'card-dark': '#0d0d0d',
          'card-light': '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
};
export default config;
