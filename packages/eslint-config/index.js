import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import tseslint from 'typescript-eslint'
import unusedImports from 'eslint-plugin-unused-imports'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      'node_modules/*',
      '!packages/blog/.vitepress/',
      'packages/blog/.vitepress/dist/*',
      'packages/blog/.vitepress/cache/*',
      'packages/blog/contents/public/javascripts/*',
      'packages/action-create-scrap/dist/*',
    ],
  },
  {
    plugins: { 'unused-imports': unusedImports },
    rules: {
      camelcase: 'off',
      'no-unused-vars': 'off',
      'import/no-named-as-default-member': 'off',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'TSEnumDeclaration',
          message: "Don't declare enums",
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
    },
  },
)
