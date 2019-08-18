module.exports = {
  extends: 'airbnb',
  plugins: [
      'react-hooks'
  ],
  globals: {
    fetch: true,
  },
  rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      "no-console": ['error', {'allow': ['warn', 'error']}],
      "no-use-before-define": 'off',
      "space-before-function-paren": 'off',

      "jsx-a11y/anchor-is-valid": 'off', // Next.js Link tags propagate href

      // TODO: Fix these
      "react/no-array-index-key": 'off',
      "jsx-a11y/no-noninteractive-tabindex": 'off',
      "jsx-a11y/no-noninteractive-element-interactions": 'off',
      "jsx-a11y/alt-text": 'off',
      "jsx-a11y/click-events-have-key-events": 'off',
      "jsx-a11y/no-static-element-interactions": 'off',
  },
  parser: "babel-eslint",
  parserOptions: {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  }
}