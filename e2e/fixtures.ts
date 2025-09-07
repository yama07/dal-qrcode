import { test as base, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { getAssetPath } from './utils/assets';
import { getMessage as _getMessage } from './utils/i18n';

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
  dalQrcodeExtension: {
    extensionId: string;
    getMessage: (key: Parameters<typeof _getMessage>[0]) => string;
  };
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

  dalQrcodeExtension: async ({ context }, use) => {
    const page = await context.newPage();
    await page.goto('chrome://extensions/');
    await page.click('cr-toggle#devMode');

    const extensionCards = await page.locator('extensions-item').all();
    const extensionInfos = await Promise.all(
      extensionCards.map(async (card) => {
        const id = await card.getAttribute('id');
        const name = (await card.locator('#name').textContent())?.trim();
        const description = (
          await card.locator('#description').textContent()
        )?.trim();
        return { id, name, description };
      }),
    );

    const dalQrcodeInfo = extensionInfos
      .filter(
        (info) =>
          info.name === _getMessage('extName', 'ja-JP') ||
          info.name === _getMessage('extName', 'en-US'),
      )
      .pop();

    if (!dalQrcodeInfo) {
      throw new Error('The Dal QRcode extension was not found.');
    }

    const lang =
      dalQrcodeInfo.description === _getMessage('extDescription', 'ja-JP')
        ? 'ja-JP'
        : 'en-US';

    const getMessage = (key: Parameters<typeof _getMessage>[0]) =>
      _getMessage(key, lang);

    await page.close();

    await use({ extensionId: dalQrcodeInfo.id!!, getMessage });
  },
});

export const expect = test.expect;
