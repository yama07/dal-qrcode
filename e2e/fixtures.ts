import { test as base } from '@playwright/test';
import { Extension, ExtensionsPage } from './pages/extensions-page';

export const test = base.extend<{
  dalQrcodeExtension: Extension;
}>({
  dalQrcodeExtension: async ({ context }, use) => {
    const page = await context.newPage();

    const extensionPage = new ExtensionsPage(page);
    const dalQrcodeExtension = await extensionPage.getDalQrcodeExtension();

    await page.close();

    use(dalQrcodeExtension);
  },
});

export const expect = test.expect;
