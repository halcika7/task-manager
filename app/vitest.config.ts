/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.test.{ts,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/setup.ts',
        '.next/',
        'dist/',
        '**/*.config.*',
        '**/*.d.ts',
        '**/*.setup.*',
        '**/*.test.*',
        '**/*.spec.*',
        './src/shared/components/ui',
        './src/middleware.ts',
        './src/app/api/**',
      ],
      skipFull: true,
      allowExternal: true,
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
