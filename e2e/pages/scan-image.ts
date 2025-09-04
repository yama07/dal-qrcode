import { Page } from '@playwright/test';

export async function openScanImagePage(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/scan-image.html`);
  await page.waitForLoadState('load');
}
