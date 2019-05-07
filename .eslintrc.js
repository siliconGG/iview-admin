module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-parsing-error': [2, { 'x-invalid-end-tag': false }],
    'no-undef': 'off',
    "camelcase": [1, {"properties": "never"}]
    // "camelcase": ["error", {"allow": ["aa_bb"]}]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
