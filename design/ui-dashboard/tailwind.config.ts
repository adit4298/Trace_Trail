import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#05070F",
          muted: "#0F111A",
          surface: "#111428",
          accent: "#15182C"
        },
        brand: {
          purple: "#7B61FF",
          blue: "#38BDF8",
          teal: "#2DD4BF",
          amber: "#FBBF24"
        }
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(91, 116, 255, 0.25)",
        card: "0 10px 40px rgba(8, 12, 30, 0.6)"
      },
      backdropBlur: {
        glass: "20px"
      },
      fontFamily: {
        sans: ["'Inter'", "ui-sans-serif", "system-ui"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};

export default config;

