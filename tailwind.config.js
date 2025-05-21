/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Main color (Blue)
        primary: {
          50: '#eef7ff',
          100: '#dceeff',
          200: '#b9dfff',
          300: '#7cc7ff',
          400: '#3aafff',
          500: '#5c5c5c', // Main blue
          600: '#3b83d0',
          700: '#2c6cb0',
          800: '#265990',
          900: '#244976',
          950: '#172e4d',
        },
        // Secondary color (Yellow/Gold)
        secondary: {
          50: '#fffbeb',
          100: '#fff4c6',
          200: '#fee989',
          300: '#fdc720', // Main yellow
          400: '#f9b628',
          500: '#f59816',
          600: '#db710e',
          700: '#b54d0f',
          800: '#933c13',
          900: '#793214',
          950: '#431807',
        },
        // Third color (Purple)
        accent: {
          50: '#f8f0ff',
          100: '#f0e1ff',
          200: '#e4c6ff',
          300: '#d39bff',
          400: '#c05cff',
          500: '#bb33f7', // Main purple
          600: '#a416df',
          700: '#8c0bbe',
          800: '#740e9c',
          900: '#610e7f',
          950: '#430056',
        },
      },
    },
  },
  plugins: [],
}