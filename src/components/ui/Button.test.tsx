import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom', // Needed for React testing!
    globals: true,         // Makes describe/it/expect available globally
  },
});
