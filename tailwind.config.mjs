import { SemicolonPreference } from "typescript";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        "archivo-narrow": '"Archivo Narrow", sans-serif',
        oswald: '"Bricolage Grotesque", sans-serif',
      },
      colors: {
        black: "rgb(24, 24, 27)",
      },
      boxShadow: {
        simple: "0px 5px 0px 0px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};
