/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0284c7",
        secondary: "#0ea5e9",
        accent: "#8b5cf6",
        "primary-50": "#f0f9ff",
        "primary-100": "#e0f2fe",
        "primary-200": "#bae6fd",
        "primary-300": "#7dd3fc",
        "primary-400": "#38bdf8",
        "primary-500": "#0ea5e9",
        "primary-600": "#0284c7",
        "primary-700": "#0369a1",
        "primary-800": "#075985",
        "primary-900": "#0c4a6e",
      },
      secondary: {
        "secondary-50": "#f5f3ff",
        "secondary-100": "#ede9fe",
        "secondary-200": "#ddd6fe",
        "secondary-300": "#c4b5fd",
        "secondary-400": "#a78bfa",
        "secondary-500": "#8b5cf6",
        "secondary-600": "#7c3aed",
        "secondary-700": "#6d28d9",
        "secondary-800": "#5b21b6",
        "secondary-900": "#4c1d95",
      },
      accent: {
        "accent-50": "#fdf4ff",
        "accent-100": "#fae8ff",
        "accent-200": "#f5d0fe",
        "accent-300": "#f0abfc",
        "accent-400": "#e879f9",
        "accent-500": "#d946ef",
        "accent-600": "#c026d3",
        "accent-700": "#a21caf",
        "accent-800": "#86198f",
        "accent-900": "#701a75",
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        ios: "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "ios-lg":
          "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)",
      },
      borderRadius: {
        ios: "12px",
      },
    },
  },
  plugins: [],
};
