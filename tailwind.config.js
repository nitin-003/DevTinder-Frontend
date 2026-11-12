const daisyThemes = require("daisyui/src/theming/themes");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}",],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          ...daisyThemes["light"],
          primary: "#f43f5e",
          "primary-content": "#ffffff",
          secondary: "#fb923c",
          "secondary-content": "#ffffff",
          accent: "#8b5cf6",
          info: "#0284c7",
          "base-100": "#ffffff",
          "base-200": "#f7f4f5",
          "base-300": "#efeaec",
          "base-content": "#1f2430",
        },
      },
      {
        dark: {
          ...daisyThemes["dark"],
          primary: "#fb7185",
          "primary-content": "#240a10",
          secondary: "#fdba74",
          "secondary-content": "#2a1405",
          accent: "#a78bfa",
          info: "#38bdf8",
          "base-100": "#1a1a23",
          "base-200": "#13131a",
          "base-300": "#23232f",
          "base-content": "#e7e7ee",
        },
      },
    ],
  },
}
