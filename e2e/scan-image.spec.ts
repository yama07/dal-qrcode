import { test, expect } from './fixtures';
import { openScanImagePage } from './pages/scan-image';
import { getMessage } from './utils/i18n';
import { dragAndDrop } from './utils/drag-and-drop';
import { getAssetPath } from './utils/assets';

test('画像を選択して、テキストのQRコードを読み取ることができる', async ({
  context,
  page,
  locale,
  extensionId,
}) => {
  await context.grantPermissions(['clipboard-write', 'clipboard-read']);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-text-Dalmatian.png'));

  await page
    .getByRole('button', {
      name: getMessage('scanFromImage__scan_button', locale),
    })
    .click();

  // テキストとして読み取ることができていること
  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');

  // URLを開くボタンが無効になっていること
  expect(
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button', locale),
      })
      .isDisabled(),
  ).toBeTruthy();

  // コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること
  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__copy_button', locale),
    })
    .click();
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(clipboardText).toEqual('Dalmatian');
});

test('画像を選択して、httpのURLのQRコードを読み取ることができる', async ({
  context,
  page,
  locale,
  extensionId,
}) => {
  await context.grantPermissions(['clipboard-write', 'clipboard-read']);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-url-http.png'));

  await page
    .getByRole('button', {
      name: getMessage('scanFromImage__scan_button', locale),
    })
    .click();

  // テキストとして読み取ることができていること
  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('http://example.com/');

  // URLを開くボタンが有効になっていること
  expect(
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button', locale),
      })
      .isEnabled(),
  ).toBeTruthy();

  // URLを開くボタンをクリックすると、読み取ったURLを別タブで開く
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button', locale),
      })
      .click(),
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toEqual('http://example.com/');

  // コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること
  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__copy_button', locale),
    })
    .click();
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(clipboardText).toEqual('http://example.com/');
});

test('画像を選択して、httpsのURLのQRコードを読み取ることができる', async ({
  context,
  page,
  locale,
  extensionId,
}) => {
  await context.grantPermissions(['clipboard-write', 'clipboard-read']);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-url-https.png'));

  await page
    .getByRole('button', {
      name: getMessage('scanFromImage__scan_button', locale),
    })
    .click();

  // テキストとして読み取ることができていること
  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('https://example.com/');

  // URLを開くボタンが有効になっていること
  expect(
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button', locale),
      })
      .isEnabled(),
  ).toBeTruthy();

  // URLを開くボタンをクリックすると、読み取ったURLを別タブで開く
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button', locale),
      })
      .click(),
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toEqual('https://example.com/');

  // コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること
  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__copy_button', locale),
    })
    .click();
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(clipboardText).toEqual('https://example.com/');
});

test('画像をドラッグ&ドロップを選択して、テキストのQRコードを読み取ることができる', async ({
  page,
  locale,
  extensionId,
}) => {
  await openScanImagePage(page, extensionId);

  await dragAndDrop(
    page,
    page.getByLabel(getMessage('scanFromImage__dropzone_label', locale)),
    getAssetPath('qrcode-text-Dalmatian.png'),
    'qrcode-text-Dalmatian.png',
    'image/png',
  );

  await page
    .getByRole('button', {
      name: getMessage('scanFromImage__scan_button', locale),
    })
    .click();

  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');
});

test('オフラインでQRコードを読み取ることができる', async ({
  context,
  page,
  locale,
  extensionId,
}) => {
  await context.setOffline(true);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-text-Dalmatian.png'));

  await page
    .getByRole('button', {
      name: getMessage('scanFromImage__scan_button', locale),
    })
    .click();

  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');
});
