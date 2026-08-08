import { defineConfig } from 'vitest/config';

export default defineConfig({
  ssr: {
    external: ['node:sqlite'],
  },
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
  },
});
