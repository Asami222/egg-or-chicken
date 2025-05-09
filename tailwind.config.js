/** @type {import('tailwindcss').Config} */

//const ui = require('@supabase/ui/dist/config/ui.config.js')
module.exports = {
  mode: 'jit',
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['var(--font-roboto)'],
        ibm_plex_sans: ['var(--font-ibm-plex-sans)'],
      },
    },
  },
  plugins: [],
}

