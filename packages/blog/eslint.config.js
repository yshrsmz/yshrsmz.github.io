import eslintConfigs from '@codingfeline/eslint-config'
import eslintPluginVue from 'eslint-plugin-vue'
import vueEslintParser from 'vue-eslint-parser'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default [
  ...eslintPluginVue.configs['flat/recommended'],
  ...eslintConfigs,
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parser: vueEslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        parser: tseslint.parser,
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: [
      'node_modules/*',
      '!.vitepress/',
      '.vitepress/dist/*',
      '.vitepress/cache/*',
      'contents/public/javascripts/*',
    ],
  },
]
