// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const unusedImports = require('eslint-plugin-unused-imports');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      'unused-imports/no-unused-imports': 'warn',
      'react/display-name': 'off',
    },
    ignores: ['dist/*', '.expo/*'],
  },
]);
