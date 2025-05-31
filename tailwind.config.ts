/** @type {import('tailwindcss').Config} */
const heroui = require("@heroui/react");

module.exports = {
  /* 
    1) Wherever Tailwind should scan for class‐names:
       – Your app/pages/components
       – Hero UI’s compiled CSS/JS in node_modules
  */
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Hero UI's own distributed files (so Tailwind knows which classes Hero UI uses)
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],

  /* If you had “important: true” before, you can keep it here: */
  important: true,

  theme: {
    extend: {
      /* 
        – Copy over any custom fonts, background‐image utilities, etc. 
        – This is exactly what you had under theme.extend in your NextUI config 
      */
      fontFamily: {
        Peyda: ["Peyda"],
      },
      backgroundImage: {
        "body-bg": "url('/files/default/bg-pattern.png')",
        "price-box-bg": "url('/files/default/price_box_bg.png')",
        "wave-bg": "url('/files/default/wave.png')",
      },
      // …any other “extend” values you still need
    },
  },

  /*
    2) Enable dark‐mode via a “.dark” class on <html> or <body>:
       (Hero UI components will automatically pick up your “dark” tokens)
  */
  darkMode: "class",

  /*
    3) Register the Hero UI plugin. 
       In v2.7.0, the package is still `@heroui/react`
  */
  plugins: [
    heroui(),
  ],
};
