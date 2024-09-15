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
        franklin: ['var(--font-franklin)'],
        postoni: ['var(--font-postoni)'],
        georgia: ['var(--font-georgia)'],
      },
    },
  },
  plugins: [],
};
export default config;
