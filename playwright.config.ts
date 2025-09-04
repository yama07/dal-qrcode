import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  // クリップボードを利用したテストで競合が発生する可能性があるため、
  // 1つのワーカーで直列実行する。
  fullyParallel: false,
  workers: 1,

  reporter: 'html',

  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium_ja-JP',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'ja-JP',
        timezoneId: 'Asia/Tokyo',
      },
    },
    {
      name: 'chromium_en-US',
      use: {
        ...devices['Desktop Chrome'],
        locale: 'en-US',
        timezoneId: 'America/New_York',
      },
    },
  ],
});
