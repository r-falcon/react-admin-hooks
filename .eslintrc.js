module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    embertest: true
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'prettier'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['react', 'react-hooks'],
  rules: {
    'react/display-name': [2, { ignoreTranspilerName: true }],
    'react/prop-types': 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}
