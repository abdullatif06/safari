import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Saifi — warm summer daylight palette
        sand: {
          50: "#FAF6EF", // page background
          100: "#F4ECDD", // sections / cards
          200: "#ECE0CC", // hover / borders-light
        },
        ink: {
          DEFAULT: "#211B17", // primary text (warm near-black)
          soft: "#6B5F54", // secondary text
          faint: "#9A8E80", // tertiary / captions
        },
        terracotta: {
          DEFAULT: "#D2603A", // primary accent / CTA
          soft: "#E07E5C",
          dark: "#B14A2C", // hover
        },
        clay: "#B14A2C",
        teal: {
          DEFAULT: "#1E8C7A", // links / sports
          soft: "#36A693",
        },
        gold: "#E0A23B", // food / highlights
        sky: "#6FA8C7", // cultural
        line: "#E4DAC8", // hairline borders
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        heavy: ["var(--font-heavy)", "var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        arabic: ["var(--font-arabic)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        "warm-fade":
          "linear-gradient(180deg, #FAF6EF 0%, #F4ECDD 100%)",
        "terracotta-gradient":
          "linear-gradient(135deg, #D2603A 0%, #E0A23B 100%)",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(33,27,23,0.04), 0 8px 24px -12px rgba(33,27,23,0.15)",
        lift: "0 12px 32px -12px rgba(33,27,23,0.25)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease-out both",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
