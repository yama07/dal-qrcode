import { Page } from '@playwright/test';

import { getMessage } from '../utils/i18n';

export async function openPopup(
  page: Page,
  extensionId: string,
  locale?: string,
) {
  await page.goto(`chrome-extension://${extensionId}/popup.html`);

  await page.waitForLoadState('load');

  const popup = {
    clickGenerateTab: async () => {
      const generateTab = page.getByRole('tab', {
        name: getMessage('popup__generate_tab', locale),
      });
      await generateTab.click();
    },
    clickScanTab: async () => {
      const scanTab = page.getByRole('tab', {
        name: getMessage('popup__scan_tab', locale),
      });
      await scanTab.click();
    },
  };
  return popup;
}
