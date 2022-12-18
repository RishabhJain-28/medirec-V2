/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    screens: {
      display: {
        min: "1920px",
      },
    },
    extend: {
      colors: {
        light: "#f2f2f2",
        primrary: "#3461eb",
      },
    },
  },
  plugins: [],
};
