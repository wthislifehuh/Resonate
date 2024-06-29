import stylisticJs from '@stylistic/eslint-plugin-js'

module.exports = [
  {
    plugins: {
      '@stylistic/js': stylisticJs
    },
    rules: {
      semi: 'error',
      'prefer-const': 'error',
      '@stylistic/js/indent': ['warn', 2],
    }
  }
];