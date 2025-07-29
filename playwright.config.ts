// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  retries: 0,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
  use: {
    baseURL: 'http://localhost:5173',
    browserName: 'chromium',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  // ← Voeg hieronder die webServer config by:
  webServer: {
    command: 'npm run dev',
    port: 5173,
    timeout: 120_000, // (2 minute vir slow servers, pas aan soos nodig)
    reuseExistingServer: !process.env.CI,
    // stdout: 'pipe', // Uncomment as jy server logs wil sien in Playwright
    // stderr: 'pipe',
  },
});
