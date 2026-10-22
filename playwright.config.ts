import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  workers: 1,
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  timeout: 30_000,
  outputDir: 'e2e/artifacts/playwright',
  reporter: [['list'], ['html', { outputFolder: 'e2e/artifacts/html', open: 'never' }]],
  use: { trace: 'on', video: 'on' },
});
