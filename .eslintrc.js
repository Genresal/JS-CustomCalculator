module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  plugins: ['prettier'],
  extends: 'standard',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error'
  }
}
