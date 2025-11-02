import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        // Modern Minimal Palette
        primary: "#2563EB", // blue-600
        accent: "#FACC15", // yellow-400
        background: "#F9FAFB", // gray-50
        card: "#FFFFFF",
        border: "#E5E7EB", // gray-200
        textPrimary: "#1F2937", // gray-800
        textSecondary: "#6B7280", // gray-500
        // Legacy SVIT mappings (for backward compatibility)
        svitPrimary: "#2563EB",
        svitPrimaryLight: "#3B82F6",
        svitPrimaryDark: "#1D4ED8",
        svitAccent: "#FACC15",
        svitAccentLight: "#FDE047",
        svitAccentDark: "#EAB308",
        svitLight: "#F9FAFB",
        svitLightGray: "#E5E7EB",
        lamaSky: "#2563EB",
        lamaSkyLight: "#DBEAFE",
        lamaPurple: "#3B82F6",
        lamaPurpleLight: "#EFF6FF",
        lamaYellow: "#FACC15",
        lamaYellowLight: "#FEFCE8",
      },
    },
  },
  plugins: [],
};
export default config;
