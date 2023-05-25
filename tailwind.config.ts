import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: 'media',
  theme: {
    extend: {
      fontFamily: {
        sans: ["Sorts Mill Goudy", "sans-serif"],
        serif: ["Rubik", "serif"]
      },
      colors: {
        cream: "#ebe8e0",
        lightDark: "#3c4649",
        dark: "#1c2321",
      }
    }
  },
  plugins: [],
} satisfies Config;
