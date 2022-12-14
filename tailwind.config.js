/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: {
          DEFAULT: "#1C1E3D",
          50: "#5C62B4",
          100: "#4F55AD",
          200: "#434791",
          300: "#363A75",
          400: "#292C59",
          500: "#1C1E3D",
          600: "#0A0B17",
          700: "#000000",
          800: "#000000",
          900: "#000000",
        },
      },
      borderWidth: {
        light: "0.01em",
      },
      transitionDuration: {
        normal: "0.1s",
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/line-clamp"),
  ],
};
