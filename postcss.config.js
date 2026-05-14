module.exports = {
  plugins: {
    'postcss-import': {
      resolve: id => {
        if (id.startsWith('storefront-kit/')) {
          return require.resolve(id)
        }
        return id
      },
    },
    tailwindcss: {},
    autoprefixer: {},
  },
}
