module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    //'@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'comma-dangle': 0,
    'vue/valid-template-root': 0,
    'indent': 0,
    'no-trailing-spaces': 0,
    'padded-blocks': 0,
    'comma-spacing': 0,
    'spaced-comment': 0,
    'key-spacing': 0,
    'space-before-blocks': 0,
    'semi': 0


  }
}
