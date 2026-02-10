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
      },
    },
  },
  plugins: [],
};
export default config;
