import { test, expect } from './fixtures';
import { PopupPage } from './pages/popup-page';
import { ScanCameraPage } from './pages/scan-camera-page';
import { ScanImagePage } from './pages/scan-image-page';
import { createExtensionTestContext } from './utils/context-fixture';

test.use({ context: createExtensionTestContext() });

test.describe('生成', () => {
  let popupPage: PopupPage;

  test.beforeEach('生成タブを開く', async ({ page, dalQrcodeExtension }) => {
    popupPage = new PopupPage(page, dalQrcodeExtension);

    await popupPage.goto();
    await popupPage.selectGenerateTab();
  });

  test('初期状態は、テキストエリアにアクティブタブのURLがセットされている', async () => {
    expect(await popupPage.getInputTextarea().inputValue()).toEqual(
      popupPage.page.url(),
    );
  });

  test('テキストエリアを入力するとQRコードが生成される', async () => {
    await popupPage.getInputTextarea().fill('foo');
    const fooQRSrc = await popupPage.getQrcodeImage().getAttribute('src');

    await popupPage.getInputTextarea().fill('bar');
    const barQRSrc = await popupPage.getQrcodeImage().getAttribute('src');

    // 異なるQRコードが生成されていること
    expect(fooQRSrc).not.toBe(barQRSrc);
  });

  test('コピーボタンをクリックすると、クリップボードにQRコードの画像がコピーされる', async ({
    context,
  }) => {
    test.skip(true, 'クリップボードの読み取りがうまくいかないためスキップ');

    await context.grantPermissions(['clipboard-write', 'clipboard-read']);

    await popupPage.getCopyButton().click();

    const clipboardItems = await popupPage.page.evaluate(async () => {
      return await navigator.clipboard.read();
    });

    expect(clipboardItems.length).toEqual(1);
    expect(clipboardItems[0].types.includes('image/png')).toBeTruthy();
  });

  test('ダウンロードボタンをクリックすると、QRコードの画像をダウンロードする', async () => {
    const downloadPromise = popupPage.page.waitForEvent('download');

    await popupPage.getDownloadButton().click();

    const download = await downloadPromise;

    const fileName = download.suggestedFilename();
    expect(fileName).toEqual('Dal-QRcode.png');
  });
});

test.describe('読み取り', () => {
  let popupPage: PopupPage;

  test.beforeEach(
    '読み取りタブを開く',
    async ({ page, dalQrcodeExtension }) => {
      popupPage = new PopupPage(page, dalQrcodeExtension);

      await popupPage.goto();
      await popupPage.selectScanTab();
    },
  );

  test('画像から読み取るボタンをクリックすると、読み取り用のタブを開く', async ({
    page,
  }) => {
    const [newPage] = await Promise.all([
      popupPage.page.context().waitForEvent('page'),
      popupPage.getScanFromImageButton().click(),
    ]);
    await newPage.waitForLoadState();

    expect(newPage.url()).toEqual(
      new ScanImagePage(page, popupPage.extension).url,
    );
  });

  test('カメラで読み取るボタンをクリックすると、読み取り用のタブを開く', async ({
    page,
  }) => {
    const [newPage] = await Promise.all([
      popupPage.page.context().waitForEvent('page'),
      popupPage.getScanWithImageButton().click(),
    ]);
    await newPage.waitForLoadState();

    expect(newPage.url()).toEqual(
      new ScanCameraPage(page, popupPage.extension).url,
    );
  });
});
