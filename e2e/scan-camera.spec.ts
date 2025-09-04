import { test, expect } from './fixtures';
import { openScanCameraPage } from './pages/scan-camera';
import { getMessage } from './utils/i18n';

test('テキストのQRコードを読み取ることができる', async ({
  contextWithFakeVideQrcodeTextDalmatian,
  locale,
  extensionId,
}) => {
  await contextWithFakeVideQrcodeTextDalmatian.grantPermissions([
    'camera',
    'clipboard-write',
    'clipboard-read',
  ]);

  const page = await contextWithFakeVideQrcodeTextDalmatian.newPage();

  await openScanCameraPage(page, extensionId);

  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__start_button', locale),
    })
    .click();

  // テキストとして読み取れていること
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

test('httpのURLのQRコードを読み取ることができる', async ({
  contextWithFakeVideQrcodeUrlHttp,
  locale,
  extensionId,
}) => {
  await contextWithFakeVideQrcodeUrlHttp.grantPermissions([
    'camera',
    'clipboard-write',
    'clipboard-read',
  ]);

  const page = await contextWithFakeVideQrcodeUrlHttp.newPage();

  await openScanCameraPage(page, extensionId);

  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__start_button', locale),
    })
    .click();

  // URLとして読み取れていること
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
    contextWithFakeVideQrcodeUrlHttp.waitForEvent('page'),
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

test('httpsのURLのQRコードを読み取ることができる', async ({
  contextWithFakeVideQrcodeUrlHttps,
  locale,
  extensionId,
}) => {
  await contextWithFakeVideQrcodeUrlHttps.grantPermissions([
    'camera',
    'clipboard-write',
    'clipboard-read',
  ]);

  const page = await contextWithFakeVideQrcodeUrlHttps.newPage();

  await openScanCameraPage(page, extensionId);

  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__start_button', locale),
    })
    .click();

  // URLとして読み取れていること
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
    contextWithFakeVideQrcodeUrlHttps.waitForEvent('page'),
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

test('オフラインでQRコードを読み取ることができる', async ({
  contextWithFakeVideQrcodeTextDalmatian,
  locale,
  extensionId,
}) => {
  await contextWithFakeVideQrcodeTextDalmatian.setOffline(true);
  await contextWithFakeVideQrcodeTextDalmatian.grantPermissions(['camera']);

  const page = await contextWithFakeVideQrcodeTextDalmatian.newPage();

  await openScanCameraPage(page, extensionId);

  await page
    .getByRole('button', {
      name: getMessage('scanWithCamera__start_button', locale),
    })
    .click();

  const result = await page.getByRole('textbox').inputValue();
  expect(result).toEqual('Dalmatian');
});
