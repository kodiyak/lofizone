import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint
  .config(
    { ignores: ['dist', '*.js'] },
    {
      extends: [js.configs.recommended, ...tseslint.configs.recommended],
      files: ['**/*.{ts,tsx}'],
      languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
      },
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
        'no-unsafe-optional-chaining': 'off',
        '@typescript-eslint/no-unused-vars': 'warn',
      },
    },
  )
  .concat(eslintPluginPrettier);
