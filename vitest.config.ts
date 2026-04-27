import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/cypress/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    alias: {
      '@thirdleaf/db': path.resolve(__dirname, './packages/db/src'),
      '@thirdleaf/types': path.resolve(__dirname, './packages/types/src'),
      '@thirdleaf/utils': path.resolve(__dirname, './packages/utils/src'),
    },
    testTransformMode: {
      ssr: [/\.[jt]sx?$/],
    },
    deps: {
      optimizer: {
        ssr: {
          enabled: true,
          include: ['date-fns', 'date-fns-tz'],
        },
      },
    },
  },
});
