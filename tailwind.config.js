/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popupFadeIn: {
          '0%': { transform: 'scale(.95)', opacity: .5 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        menuFadeIn: {
          '0%': { position: 'relative', top: -20, left: -24, transform: 'scale(.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', position: 'relative', top: 0, left: 0, opacity: 1 },
        },
      },

      colors: {
        transparent: 'transparent',
        primary: "#3c82e8",
        danger: "#de4c43",
        'dark-400': "#353c44",
        'dark-500': "#2f363d",
        'dark-600': "#2e3236",
        'dark-700': "#292e31",
        secondary: "var(--secondary)",
        main: "var(--main)",
        background: "var(--background)",
        header: "var(--header)",
        accent: "var(--accent)",
      },
    },
  },
  plugins: [],
}
