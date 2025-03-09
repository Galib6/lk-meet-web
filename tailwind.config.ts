module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addComponents }: any) {
      addComponents({
        '.container': {
          paddingLeft: '1rem',
          paddingRight: '1rem',
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '640px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          },
          '@screen md': {
            maxWidth: '768px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          },
          '@screen lg': {
            maxWidth: '1000px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          },
          '@screen xl': {
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1.2rem',
            paddingRight: '1.2rem',
          },
          '@screen 2xl': {
            maxWidth: '1280px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: '1rem',
            paddingRight: '1rem',
          },
        },
      });
    },
  ],
};
