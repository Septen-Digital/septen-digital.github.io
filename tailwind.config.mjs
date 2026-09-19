/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,css,ts}"],
  theme: {
    screens: {
      sm: "40rem",
      md: "48rem",
      lg: "64rem",
      xl: "80rem",
      "2xl": "96rem",
      "3xl": "120rem",
      "4xl": "160rem",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        "brand-teal": "#14818b",
        "brand-teal-dark": "#005057",
        "brand-orange": "#af6245",
        "brand-orange-dark": "#8a4a35",
        "brand-cream": "#ffddd2",
        "brand-mint": "#83c5be",
      },
      boxShadow: {
        "brand-teal": "0 0.25rem 1.25rem rgb(0 109 119 / 25%)",
      },
    },
  },
};
