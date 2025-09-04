import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { getAssetPath } from './utils/assets';

const pathToExtension = path.resolve('.output/chrome-mv3');

const createCustomContext =
  (fakeVideoCapture?: string) =>
  async (
    { locale }: { locale?: string },
    use: (r: BrowserContext) => Promise<void>,
  ) => {
    const args = [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ];
    if (locale) {
      args.push(`--lang=${locale}`);
    }
    if (fakeVideoCapture) {
      args.push(
        ...[
          '--use-fake-ui-for-media-stream',
          '--use-fake-device-for-media-stream',
          `--use-file-for-fake-video-capture=${fakeVideoCapture}`,
        ],
      );
    }

    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args,
    });
    await use(context);
    await context.close();
  };

export const test = base.extend<{
  context: BrowserContext;
  contextWithFakeVideQrcodeTextDalmatian: BrowserContext;
  contextWithFakeVideQrcodeUrlHttp: BrowserContext;
  contextWithFakeVideQrcodeUrlHttps: BrowserContext;
  extensionId: string;
}>({
  context: createCustomContext(),

  contextWithFakeVideQrcodeTextDalmatian: createCustomContext(
    getAssetPath('qrcode-text-Dalmatian.y4m'),
  ),

  contextWithFakeVideQrcodeUrlHttp: createCustomContext(
    getAssetPath('qrcode-url-http.y4m'),
  ),

  contextWithFakeVideQrcodeUrlHttps: createCustomContext(
    getAssetPath('qrcode-url-https.y4m'),
  ),

  extensionId: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto('chrome://extensions/');
    await page.click('cr-toggle#devMode');

    const extensionCard = page.locator('extensions-item').first();
    const extensionId = await extensionCard.getAttribute('id');

    await page.close();

    if (!extensionId) {
      throw new Error('The extension ID could not be identified.');
    }
    await use(extensionId);
  },
});

export const expect = test.expect;
