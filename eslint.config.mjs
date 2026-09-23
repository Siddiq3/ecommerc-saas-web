import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/**
 * Lint rules for the website.
 *
 * `next lint` is deprecated in Next 15 and, with no config present, prompted for setup
 * instead of linting — which meant the lint script never actually ran. This is a flat
 * config driving the ESLint CLI directly.
 */
export default [
  js.configs.recommended,
  {
    files: ['app/**/*.{js,jsx}', 'components/**/*.{js,jsx}', 'lib/**/*.js'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        console: 'readonly',
        process: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        URLSearchParams: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        Headers: 'readonly',
        crypto: 'readonly',
        Buffer: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        performance: 'readonly',
        window: 'readonly',
        document: 'readonly',
        history: 'readonly',
        location: 'readonly',
        localStorage: 'readonly',
        IntersectionObserver: 'readonly',
        AbortController: 'readonly',
      },
    },
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
  { ignores: ['.next/**', 'node_modules/**', 'out/**'] },
];
