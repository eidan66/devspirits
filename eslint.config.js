import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import next from '@next/eslint-plugin-next';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        HTMLElement: 'readonly',
        HTMLDivElement: 'readonly',
        Event: 'readonly',
        EventTarget: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        confirm: 'readonly',
        localStorage: 'readonly',
        alert: 'readonly',
        prompt: 'readonly',
        btoa: 'readonly',
        navigator: 'readonly',
        process: 'readonly',
        React: 'readonly',
        performance: 'readonly',
        fetch: 'readonly',
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      'react-hooks': reactHooks,
      import: importPlugin,
      prettier: prettier,
      'unused-imports': unusedImports,
      '@next/next': next,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-hooks/set-state-in-effect': 'off', // Allow setState in effects for initialization
      'import/no-cycle': ['error', { maxDepth: 1 }],
      '@typescript-eslint/no-empty-object-type': 'off',
      'import/no-named-as-default-member': 'off',
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'no-duplicate-imports': 'error',
      'no-confusing-arrow': 'off',
      'no-else-return': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      curly: 'error',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      'default-case': 'warn',
      'no-nested-ternary': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'default-param-last': 'warn',
      'prefer-const': 'error',
      'no-return-await': 'error',
      'prefer-arrow-callback': 'error',
      'no-var': 'error',
      'no-undef-init': 'error',
      'no-useless-return': 'error',
      'no-return-assign': 'error',
      'import/no-named-as-default': 'off',
      'require-await': 'error',
      'no-lonely-if': 'error',
      eqeqeq: ['error', 'always'],
      'prefer-destructuring': 'off',
      'import/prefer-default-export': 'off',
      'import/no-default-export': 'off',
      'sort-imports': [
        'warn',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'unknown',
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'prettier/prettier': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['./tsconfig.json'],
        },
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.svg'],
          moduleDirectory: ['src/', 'node_modules'],
        },
      },
    },
  },
  {
    files: ['**/__tests__/**/*.[jt]s?(x)', '**/tests/**/*.[jt]s?(x)'],
    languageOptions: {
      globals: {
        jest: true,
      },
    },
  },
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.storybook/',
      '*.config.js',
      '*.config.ts',
      '.next/',
      'next-env.d.ts',
      'scripts/**/*.js',
      'scripts/**/*.mjs',
      'deploy-firebase-indexes.js',
      '.eslintrc.js',
    ],
  },
];
