module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'neomorph-inner': 'inset 6px 6px 12px #c1c1c1, inset -6px -6px 12px #ffffff',
        'neomorph-outer': '6px 6px 12px #c1c1c1, -6px -6px 12px #ffffff',
      },
    },
  },
  plugins: [],
};
