import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

// Load test environment variables
dotenv.config({ path: path.resolve(__dirname, '.env.test') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Add test timeout
  timeout: 30000, // 30 seconds

  // Improve reporting
  reporter: [
    ['html'],
    ['list'], // Adds command line reporting
  ],

  use: {
    baseURL: 'http://localhost:3000',
    // Capture trace for all test failures
    trace: 'on-first-retry',
    // Record video for all tests
    video: {
      mode: 'retain-on-failure',
      size: { width: 640, height: 480 },
    },
    // Add screenshot on failure
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'setup', testMatch: /e2e\/.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Add more browsers if needed
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
  ],

  webServer: {
    command: process.env.CI ? 'pnpm build && pnpm start' : 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    timeout: 180 * 1000, // 3 minutes
  },
});
