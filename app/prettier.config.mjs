/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  trailingComma: 'es5',
  printWidth: 80,
  tabWidth: 2,
  semi: true,
  endOfLine: 'auto',
  arrowParens: 'avoid',
  bracketSpacing: true,
  proseWrap: 'preserve',
  useTabs: false,
  plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
