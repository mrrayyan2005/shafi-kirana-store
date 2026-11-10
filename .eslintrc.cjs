module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // This project uses simple inline props (no prop-types package)
    'react/prop-types': 'off',
    // CartContext exports both provider + hook; that is intentional
    'react-refresh/only-export-components': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
  },
  overrides: [
    {
      files: ['api/**/*.js', 'scripts/**/*.{js,mjs}'],
      env: { node: true, es2020: true },
    },
  ],
}
