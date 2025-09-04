import { test, expect } from './fixtures';
import { openPopup } from './pages/popup';
import { getMessage } from './utils/i18n';

test.describe('生成', () => {
  test('初期状態は、テキストエリアにアクティブタブのURLがセットされている', async ({
    page,
    locale,
    extensionId,
  }) => {
    const popup = await openPopup(page, extensionId, locale);
    await popup.clickGenerateTab();

    expect(await page.getByRole('textbox').inputValue()).toEqual(page.url());
  });

  test('テキストエリアを入力するとQRコードが生成される', async ({
    page,
    locale,
    extensionId,
  }) => {
    const popup = await openPopup(page, extensionId, locale);
    await popup.clickGenerateTab();

    await page.getByRole('textbox').fill('foo');
    const fooQRSrc = await page
      .getByRole('img', { name: 'QR Code' })
      .getAttribute('src');

    await page.getByRole('textbox').fill('bar');
    const barQRSrc = await page
      .getByRole('img', { name: 'QR Code' })
      .getAttribute('src');

    // 異なるQRコードが生成されていること
    expect(fooQRSrc).not.toBe(barQRSrc);
  });

  test('コピーボタンをクリックすると、クリップボードにQRコードの画像がコピーされる', async ({
    context,
    page,
    locale,
    extensionId,
  }) => {
    test.skip(true, 'クリップボードの読み取りがうまくいかないためスキップ');

    await context.grantPermissions(['clipboard-write', 'clipboard-read']);

    const popup = await openPopup(page, extensionId, locale);
    await popup.clickGenerateTab();

    await page
      .getByRole('button', {
        name: getMessage('popup_generate__copy_button', locale),
      })
      .click();

    const clipboardItems = await page.evaluate(async () => {
      return await navigator.clipboard.read();
    });

    expect(clipboardItems.length).toEqual(1);
    expect(clipboardItems[0].types.includes('image/png')).toBeTruthy();
  });

  test('ダウンロードボタンをクリックすると、QRコードの画像をダウンロードする', async ({
    page,
    locale,
    extensionId,
  }) => {
    const popup = await openPopup(page, extensionId, locale);
    await popup.clickGenerateTab();

    const downloadPromise = page.waitForEvent('download');

    await page
      .getByRole('button', {
        name: getMessage('popup_generate__download_button', locale),
      })
      .click();

    const download = await downloadPromise;

    const fileName = download.suggestedFilename();
    expect(fileName).toEqual('Dal-QRcode.png');
  });

  test('オフラインでQRコードを生成することができる', async ({
    context,
    page,
    locale,
    extensionId,
  }) => {
    context.setOffline(true);

    const popup = await openPopup(page, extensionId, locale);
    await popup.clickGenerateTab();

    const initQRSrc = await page
      .getByRole('img', { name: 'QR Code' })
      .getAttribute('src');

    await page.getByRole('textbox').fill('Dalmatian');
    const newQRSrc = await page
      .getByRole('img', { name: 'QR Code' })
      .getAttribute('src');

    // 別々のQRコードが生成されていること
    expect(initQRSrc).not.toBe(newQRSrc);
  });
});

test.describe('読み取り', () => {
  test('画像から読み取るボタンをクリックすると、読み取り用のタブを開く', async ({
    context,
    page,
    locale,
    extensionId,
  }) => {
    const popup = await openPopup(page, extensionId, locale);
    await popup.clickScanTab();

    const [scanFromImagePage] = await Promise.all([
      context.waitForEvent('page'),
      page
        .getByRole('button', {
          name: getMessage('popup_scan__scanFromImage_button', locale),
        })
        .click(),
    ]);
    await scanFromImagePage.waitForLoadState();
    const scanFromImagePageTitle = await scanFromImagePage.title();
    expect(scanFromImagePageTitle).toEqual(
      getMessage('scanFromImage__title', locale),
    );
  });

  test('カメラで読み取るボタンをクリックすると、読み取り用のタブを開く', async ({
    context,
    page,
    locale,
    extensionId,
  }) => {
    const popup = await openPopup(page, extensionId, locale);
    await popup.clickScanTab();

    const [scanFromImagePage] = await Promise.all([
      context.waitForEvent('page'),
      page
        .getByRole('button', {
          name: getMessage('popup_scan__scanWithCamera_button', locale),
        })
        .click(),
    ]);
    await scanFromImagePage.waitForLoadState();
    const scanFromImagePageTitle = await scanFromImagePage.title();
    expect(scanFromImagePageTitle).toEqual(
      getMessage('scanWithCamera__title', locale),
    );
  });
});
