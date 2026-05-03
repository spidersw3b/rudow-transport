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
        rt: {
          navy: "#1B2B5E",
          "navy-dark": "#0F1A3A",
          "navy-mid": "#243474",
          "navy-light": "#EEF1F8",
          blue: "#2563EB",
          "blue-dark": "#1D4ED8",
          "blue-light": "#DBEAFE",
          white: "#FFFFFF",
          gray: "#F5F5F5",
          "gray-mid": "#E2E8F0",
          "text-dark": "#0F172A",
          "text-mid": "#475569",
          "text-light": "#94A3B8",
        },
        badge: {
          green: "#22C55E",
          blue: "#3B82F6",
          yellow: "#F59E0B",
          orange: "#F97316",
          red: "#EF4444",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "Impact", "sans-serif"],
        body: ["var(--font-inter)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
