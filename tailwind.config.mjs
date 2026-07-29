/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,css,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Space Grotesk", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        "brand-teal": "#006d77",
        "brand-teal-dark": "#00545c",
        "brand-orange": "#e29578",
        "brand-orange-dark": "#d88465",
        "brand-cream": "#ffddd2",
        "brand-mint": "#83c5be",
      },
      boxShadow: {
        "brand-teal": "0 0.25rem 1.25rem rgb(0 109 119 / 25%)",
      },
    },
  },
};
