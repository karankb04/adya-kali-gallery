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
        bg: "#f3eeeb",
        "bg-soft": "#eae2dd",
        paper: "#ffffff",
        red: { DEFAULT: "#db1f24", deep: "#9c0f14" },
        sindoor: "#f0411c",
        rose: "#e23b34",
        ink: { DEFAULT: "#231712", soft: "#7c6a60" },
        cream: "#fbf2e4",
        line: "rgba(199,40,44,0.16)",
      },
      fontFamily: {
        display: ["Bricolage Grotesque", "system-ui", "sans-serif"],
        body: ["Hanken Grotesk", "system-ui", "sans-serif"],
        deva: ["Mukta", "Hanken Grotesk", "sans-serif"],
        cinzel: ["Cinzel Decorative", "Georgia", "serif"],
      },
      animation: {
        "scroll-up": "scrollY 52s linear infinite",
        "scroll-up-slow": "scrollY 60s linear infinite",
        "scroll-up-fast": "scrollY 44s linear infinite",
        wave: "wave 9s ease-in-out infinite",
        drop: "drop 2.4s ease-in-out infinite",
      },
      keyframes: {
        scrollY: {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-50%)" },
        },
        wave: {
          "0%,100%": { transform: "translateY(0) scaleY(1)" },
          "50%": { transform: "translateY(-6px) scaleY(1.03)" },
        },
        drop: {
          "0%,100%": { opacity: "0.3", transform: "scaleY(0.6)" },
          "50%": { opacity: "1", transform: "scaleY(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
