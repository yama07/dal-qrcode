import { test, expect } from './fixtures';
import { getAssetPath } from './utils/assets';
import { ScanImagePage } from './pages/scan-image-page';
import { createExtensionTestContext } from './utils/context-fixture';

test.use({
  context: createExtensionTestContext(),
});

test.describe('画像を選択して、テキストのQRコードを読み取ることができる', () => {
  let scanImagePage: ScanImagePage;

  test.beforeEach(
    '画像を選択して読み取りをおこなう',
    async ({ context, page, dalQrcodeExtension }) => {
      await context.grantPermissions(['clipboard-write', 'clipboard-read']);

      scanImagePage = new ScanImagePage(page, dalQrcodeExtension);

      await scanImagePage.goto();

      await scanImagePage.setImageFile(
        getAssetPath('qrcode-text-Dalmatian.png'),
      );

      await scanImagePage.getScanButton().click();
    },
  );

  test('テキストとして読み取ることができていること', async () => {
    const result = await scanImagePage.getResultTextarea().inputValue();

    expect(result).toEqual('Dalmatian');
  });

  test('URLを開くボタンが無効になっていること', async () => {
    expect(await scanImagePage.getOpenUrlButton().isDisabled()).toBeTruthy();
  });

  test('コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること', async () => {
    await scanImagePage.getCopyButton().click();
    const clipboardText = await scanImagePage.page.evaluate(async () => {
      return await navigator.clipboard.readText();
    });

    expect(clipboardText).toEqual('Dalmatian');
  });
});

[
  {
    scheme: 'http',
    imagePath: getAssetPath('qrcode-url-http.png'),
    resultText: 'http://example.com/',
  },
  {
    scheme: 'https',
    imagePath: getAssetPath('qrcode-url-https.png'),
    resultText: 'https://example.com/',
  },
].forEach(({ scheme, imagePath, resultText }) => {
  test.describe(`画像を選択して、${scheme}のURLのQRコードを読み取ることができる`, () => {
    let scanImagePage: ScanImagePage;

    test.beforeEach(
      '画像を選択して読み取りをおこなう',
      async ({ context, page, dalQrcodeExtension }) => {
        await context.grantPermissions(['clipboard-write', 'clipboard-read']);

        scanImagePage = new ScanImagePage(page, dalQrcodeExtension);

        await scanImagePage.goto();

        await scanImagePage.setImageFile(imagePath);

        await scanImagePage.getScanButton().click();
      },
    );

    test('テキストとして読み取ることができていること', async () => {
      const result = await scanImagePage.getResultTextarea().inputValue();

      expect(result).toEqual(resultText);
    });

    test('URLを開くボタンが有効になっていること', async () => {
      expect(await scanImagePage.getOpenUrlButton().isEnabled()).toBeTruthy();
    });

    test('URLを開くボタンをクリックすると、読み取ったURLを別タブで開く', async () => {
      const [newPage] = await Promise.all([
        scanImagePage.page.context().waitForEvent('page'),
        scanImagePage.getOpenUrlButton().click(),
      ]);
      await newPage.waitForLoadState();

      expect(newPage.url()).toEqual(resultText);
    });

    test('コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること', async () => {
      await scanImagePage.getCopyButton().click();
      const clipboardText = await scanImagePage.page.evaluate(async () => {
        return await navigator.clipboard.readText();
      });

      expect(clipboardText).toEqual(resultText);
    });
  });
});

test('画像をドラッグ&ドロップを選択して、テキストのQRコードを読み取ることができる', async ({
  page,
  dalQrcodeExtension,
}) => {
  const scanImagePage = new ScanImagePage(page, dalQrcodeExtension);

  await scanImagePage.goto();
  await scanImagePage.setImageFileWithDragAndDrop(
    getAssetPath('qrcode-text-Dalmatian.png'),
  );
  await scanImagePage.getScanButton().click();

  const result = await scanImagePage.getResultTextarea().inputValue();

  expect(result).toEqual('Dalmatian');
});
