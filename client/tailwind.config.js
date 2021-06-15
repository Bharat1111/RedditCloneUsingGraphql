module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      body: ['IBM Plaex Sans']
    },
    extend: {
      spacing: {
        70: '17.5rem'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
