import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#201d17",
        cream: "#fbf7ed",
        paper: "#fffdf8",
        gold: "#f6bd3a",
        "gold-soft": "#ffe7a3",
        sage: "#b9c8a9",
        coral: "#ee8b67",
      },
      boxShadow: {
        soft: "0 18px 60px rgba(65, 52, 24, 0.10)",
        card: "0 8px 30px rgba(65, 52, 24, 0.08)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};

export default config;
