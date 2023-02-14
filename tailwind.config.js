/** @type {import('tailwindcss').Config} */
const colors = {
  'black-1': '#020a12',
  'black-2': '#081829',
  'black-3': '#0a396b',
  "blue-1": "#a2d8fa",
  "blue-2": "#5F85DB",
  "blue-link": "#02c8f0"
}

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    fontFamily: {
      satoshi: 'Satoshi',
      satoshiVar: 'Satoshi-Variable'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem'
    },
    screens: {
      sidebar: '420px',
      xs: '425px',
      sm: '500px',
      smd: '768px',
      slg: '862px',
      690: '690px',
      xl: '1280px',
      preTablet: { min: '599px', max: '1100px' },
      mobile: { max: '599px' },
      smallTablet: { min: '600px', max: '767px' },
      tablet: { min: '768px', max: '1024px' },
      desktop: { min: '1025px' },
      'hover-hover': { raw: '(hover: hover)' }
    },
    extend: {
      colors: colors, dark: {
        css: {
          color: 'white',
        },
      },
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar')({ nocompatible: true }),
    require('@tailwindcss/line-clamp'),
  ]
}
