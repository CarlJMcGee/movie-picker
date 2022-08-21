/** @type {import('tailwindcss').Config} */
const plugin = require("tailwindcss/plugin");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-1": "#c5d5ea",
        "blue-2": "#8f9eb2",
        "blue-3": "#d7f3ff",
        "blue-4": "#253445",
        "blue-5": "#398b83",
        "purple-1": "#834e69",
        "brown-1": "#ffedcb",
        "brown-2": "#6c3c00",
      },
      fontFamily: {
        serif: ["Garamond"],
      },
      textShadow: {
        sm: "0 1px 2px var(--tw-shadow-color)",
        DEFAULT: "0 2px 4px var(--tw-shadow-color)",
        lg: "0 8px 16px var(--tw-shadow-color)",
      },
    },
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          "text-shadow": (value) => ({
            textShadow: value,
          }),
        },
        { values: theme("textShadow") }
      );
    }),
  ],
};
