import storefrontKit from 'storefront-kit/tailwind'

export default {
  presets: [storefrontKit],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/storefront-kit/dist/**/*.{js,mjs}', // required: scan component class names
  ],
}
