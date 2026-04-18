import { test, expect } from './fixtures';
import { ScanCameraPage } from './pages/scan-camera-page';
import { createExtensionTestContext } from './utils/context-fixture';

test.describe('テキストのQRコードを読み取ることができる', () => {
  test.use({
    context: createExtensionTestContext('qrcode-text-Dalmatian.y4m'),
  });

  let scanCameraPage: ScanCameraPage;

  test.beforeEach(
    'カメラで読み取りをおこなう',
    async ({ context, page, dalQrcodeExtension }) => {
      await context.grantPermissions([
        'camera',
        'clipboard-write',
        'clipboard-read',
      ]);

      scanCameraPage = new ScanCameraPage(page, dalQrcodeExtension);

      await scanCameraPage.goto();

      await scanCameraPage.getStartButton().click();
    },
  );

  test('テキストとして読み取ることができていること', async () => {
    const result = await scanCameraPage.getResultTextarea().inputValue();

    expect(result).toEqual('Dalmatian');
  });

  test('URLを開くボタンが無効になっていること', async () => {
    expect(await scanCameraPage.getOpenUrlButton().isDisabled()).toBeTruthy();
  });

  test('コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること', async () => {
    await scanCameraPage.getCopyButton().click();
    const clipboardText = await scanCameraPage.page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    expect(clipboardText).toEqual('Dalmatian');
  });
});

[
  {
    scheme: 'http',
    context: createExtensionTestContext('qrcode-url-http.y4m'),
    resultText: 'http://example.com/',
    pageUrl: /https?:\/\/example\.com\/?/, // httpsにリダイレクトされる場合があるため
  },
  {
    scheme: 'https',
    context: createExtensionTestContext('qrcode-url-https.y4m'),
    resultText: 'https://example.com/',
    pageUrl: 'https://example.com/',
  },
].forEach(({ scheme, context, resultText, pageUrl }) => {
  test.describe(`${scheme}のURLのQRコードを読み取ることができる`, () => {
    test.use({ context });

    let scanCameraPage: ScanCameraPage;

    test.beforeEach(
      'カメラで読み取りをおこなう',
      async ({ context, page, dalQrcodeExtension }) => {
        await context.grantPermissions([
          'camera',
          'clipboard-write',
          'clipboard-read',
        ]);

        scanCameraPage = new ScanCameraPage(page, dalQrcodeExtension);

        await scanCameraPage.goto();

        await scanCameraPage.getStartButton().click();
      },
    );

    test('テキストとして読み取ることができていること', async () => {
      const result = await scanCameraPage.getResultTextarea().inputValue();

      expect(result).toEqual(resultText);
    });

    test('URLを開くボタンが有効になっていること', async () => {
      expect(await scanCameraPage.getOpenUrlButton().isEnabled()).toBeTruthy();
    });

    test('コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること', async () => {
      await scanCameraPage.getCopyButton().click();
      const clipboardText = await scanCameraPage.page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });

      expect(clipboardText).toEqual(resultText);
    });

    test('URLを開くボタンをクリックすると、読み取ったURLを別タブで開く', async () => {
      await scanCameraPage.page.context().setOffline(false);

      const [newPage] = await Promise.all([
        scanCameraPage.page.context().waitForEvent('page'),
        scanCameraPage.getOpenUrlButton().click(),
      ]);
      await newPage.waitForLoadState();

      await expect(newPage).toHaveURL(pageUrl);
    });
  });
});

test.describe('カメラの権限を与えない', () => {
  test.use({
    context: createExtensionTestContext(),
  });

  let scanCameraPage: ScanCameraPage;

  test.beforeEach(
    'カメラで読み取りをおこなう',
    async ({ context, page, dalQrcodeExtension }) => {
      await context.grantPermissions([]);

      scanCameraPage = new ScanCameraPage(page, dalQrcodeExtension);

      await scanCameraPage.goto();
    },
  );

  test('エラーメッセージが表示される', async ({}) => {
    const alertMessage = (
      await scanCameraPage.getAlert().textContent()
    )?.trim();

    expect(alertMessage).toEqual(
      scanCameraPage.getMessage('scanWithCamera__notAvailableCamera_error'),
    );
  });
});
