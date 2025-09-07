import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  timeout: 10_000,

  // クリップボードを利用したテストで競合が発生する可能性があるため、
  // 1つのワーカーで直列実行する。
  fullyParallel: false,
  workers: 1,

  reporter: 'html',

  use: {
    trace: process.env.CI ? 'on' : 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
