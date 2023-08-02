/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#d2e069",

          "secondary": "#d1642e",

          "accent": "#5ad4ed",

          "neutral": "#131720",

          "base-100": "#382541",

          "info": "#5a8edd",

          "success": "#72eeaa",

          "warning": "#c38013",

          "error": "#f54d66",
        },
      },
    ],
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
    },
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
  },
  plugins: [require("daisyui")],
}
