import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';
import reactCompiler from 'eslint-plugin-react-compiler';
import { fixupConfigRules } from '@eslint/compat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

function getDirectoriesToSort() {
  const ignoredSortingDirectories = [
    '.git',
    '.next',
    '.vscode',
    'node_modules',
  ];
  return getDirectories(process.cwd()).filter(
    f => !ignoredSortingDirectories.includes(f)
  );
}

function getDirectories(path) {
  return fs.readdirSync(path).filter(file => {
    return fs.statSync(`${path}/${file}`).isDirectory();
  });
}

const eslintConfig = [
  {
    ignores: ['**/.eslintrc.js', '**/*.mjs', '**/.next', '**/node_modules'],
  },
  ...fixupConfigRules(
    compat.extends(
      'next/core-web-vitals',
      'next/typescript',
      'prettier',
      'react-app',
      'plugin:jsx-a11y/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
      'plugin:react-hooks/recommended'
      // "plugin:tailwindcss/recommended"
    )
  ),
  {
    plugins: {
      'no-relative-import-paths': noRelativeImportPaths,
      'react-compiler': reactCompiler,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',

      parserOptions: {
        tsconfigRootDir: '.',
        project: './tsconfig.json',

        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    settings: {
      react: {
        version: 'detect',
      },

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.js'],
      },

      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: 'tsconfig.json',
        },

        node: {
          extensions: ['.ts', '.tsx', '.js'],
        },
      },
    },

    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'import/no-default-export': 'off',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'react/react-in-jsx-scope': 'off',

      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.ts', '.tsx'],
        },
      ],

      'react/jsx-props-no-spreading': 'off',

      'no-param-reassign': [
        'error',
        {
          props: false,
        },
      ],

      'import/prefer-default-export': 'off',
      'react/jsx-uses-react': 'off',
      'tailwindcss/no-custom-classname': 'off',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],

      'tailwindcss/classnames-order': 'off',

      'import/order': [
        'error',
        {
          groups: [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
          pathGroups: [
            ...getDirectoriesToSort().map(singleDir => ({
              pattern: `${singleDir}/**`,
              group: 'internal',
            })),
            {
              pattern: 'env',
              group: 'internal',
            },
            {
              pattern: 'theme',
              group: 'internal',
            },
            {
              pattern: 'public/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['internal'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.config.js',
            '**/*.config.ts',
            '**/*.config.mjs',
            'report-bundle-size.mjs',
          ],
        },
      ],

      'global-require': 'off',

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          js: 'never',
          jsx: 'never',
          ts: 'never',
          tsx: 'never',
        },
      ],

      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: false,
          rootDir: 'src',
          prefix: '@',
        },
      ],

      'react/require-default-props': 'off',
      'no-underscore-dangle': 'off',
      camelcase: 'off',
      'react-compiler/react-compiler': 'error',

      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: [
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/setup.ts',
            'vitest.config.ts',
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.test.*',
      '**/*.spec.*',
      '**/tests/**/*',
      '**/e2e/**/*',
      '*.config.*',
    ],
    rules: {
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    },
  },
];

export default eslintConfig;
