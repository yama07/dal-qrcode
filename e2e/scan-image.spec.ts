import { test, expect } from './fixtures';
import { openScanImagePage } from './pages/scan-image';
import { dragAndDrop } from './utils/drag-and-drop';
import { getAssetPath } from './utils/assets';

test('画像を選択して、テキストのQRコードを読み取ることができる', async ({
  context,
  page,
  dalQrcodeExtension,
}) => {
  const { extensionId, getMessage } = dalQrcodeExtension;

  await context.grantPermissions(['clipboard-write', 'clipboard-read']);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-text-Dalmatian.png'));

  await page
    .getByRole('button', { name: getMessage('scanFromImage__scan_button') })
    .click();

  // テキストとして読み取ることができていること
  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');

  // URLを開くボタンが無効になっていること
  expect(
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button'),
      })
      .isDisabled(),
  ).toBeTruthy();

  // コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること
  await page
    .getByRole('button', { name: getMessage('scanWithCamera__copy_button') })
    .click();
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(clipboardText).toEqual('Dalmatian');
});

test('画像を選択して、httpのURLのQRコードを読み取ることができる', async ({
  context,
  page,
  dalQrcodeExtension,
}) => {
  const { extensionId, getMessage } = dalQrcodeExtension;

  await context.grantPermissions(['clipboard-write', 'clipboard-read']);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-url-http.png'));

  await page
    .getByRole('button', { name: getMessage('scanFromImage__scan_button') })
    .click();

  // テキストとして読み取ることができていること
  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('http://example.com/');

  // URLを開くボタンが有効になっていること
  expect(
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button'),
      })
      .isEnabled(),
  ).toBeTruthy();

  // コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること
  await page
    .getByRole('button', { name: getMessage('scanWithCamera__copy_button') })
    .click();
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(clipboardText).toEqual('http://example.com/');

  // URLを開くボタンをクリックすると、読み取ったURLを別タブで開く
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button'),
      })
      .click(),
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toEqual('http://example.com/');
});

test('画像を選択して、httpsのURLのQRコードを読み取ることができる', async ({
  context,
  page,
  dalQrcodeExtension,
}) => {
  const { extensionId, getMessage } = dalQrcodeExtension;

  await context.grantPermissions(['clipboard-write', 'clipboard-read']);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-url-https.png'));

  await page
    .getByRole('button', { name: getMessage('scanFromImage__scan_button') })
    .click();

  // テキストとして読み取ることができていること
  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('https://example.com/');

  // URLを開くボタンが有効になっていること
  expect(
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button'),
      })
      .isEnabled(),
  ).toBeTruthy();

  // コピーボタンをクリックすると、読み取った結果がクリップボードにコピーされること
  await page
    .getByRole('button', { name: getMessage('scanWithCamera__copy_button') })
    .click();
  const clipboardText = await page.evaluate(async () => {
    return await navigator.clipboard.readText();
  });
  expect(clipboardText).toEqual('https://example.com/');

  // URLを開くボタンをクリックすると、読み取ったURLを別タブで開く
  const [newPage] = await Promise.all([
    context.waitForEvent('page'),
    page
      .getByRole('button', {
        name: getMessage('scanWithCamera__openUrl_button'),
      })
      .click(),
  ]);
  await newPage.waitForLoadState();
  expect(newPage.url()).toEqual('https://example.com/');
});

test('画像をドラッグ&ドロップを選択して、テキストのQRコードを読み取ることができる', async ({
  page,
  dalQrcodeExtension,
}) => {
  const { extensionId, getMessage } = dalQrcodeExtension;

  await openScanImagePage(page, extensionId);

  await dragAndDrop(
    page,
    page.getByLabel(getMessage('scanFromImage__dropzone_label')),
    getAssetPath('qrcode-text-Dalmatian.png'),
    'qrcode-text-Dalmatian.png',
    'image/png',
  );

  await page
    .getByRole('button', { name: getMessage('scanFromImage__scan_button') })
    .click();

  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');
});

test('オフラインでQRコードを読み取ることができる', async ({
  context,
  page,
  dalQrcodeExtension,
}) => {
  const { extensionId, getMessage } = dalQrcodeExtension;

  await context.setOffline(true);

  await openScanImagePage(page, extensionId);

  await page
    .locator('input[type="file"]')
    .setInputFiles(getAssetPath('qrcode-text-Dalmatian.png'));

  await page
    .getByRole('button', { name: getMessage('scanFromImage__scan_button') })
    .click();

  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');
});
