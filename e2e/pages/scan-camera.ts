import { Page } from '@playwright/test';

export async function openScanCameraPage(page: Page, extensionId: string) {
  await page.goto(`chrome-extension://${extensionId}/scan-camera.html`);
  await page.waitForLoadState('load');
}
