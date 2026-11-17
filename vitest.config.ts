import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@chaikit/core': resolve(__dirname, 'packages/core/src/index.ts'),
      'chaikit': resolve(__dirname, 'packages/widget/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    include: ['packages/*/tests/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
