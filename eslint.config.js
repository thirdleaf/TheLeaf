import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const prettier = require('eslint-config-prettier');

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      '**/next-env.d.ts',
      '**/.next/**',
    ],
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  }
);
