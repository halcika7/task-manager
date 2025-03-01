const config = {
  '**/*.(ts|js|tsx|jsx)': filenames => {
    return [`pnpm prettier --write ${filenames.join(' ')}`];
  },
  '**/*.(ts|js|tsx|jsx)': filenames => {
    return [`pnpm eslint --fix ${filenames.join(' ')}`];
  },
};

export default config;
