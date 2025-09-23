import { chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';
import { AssetName, getAssetPath } from '../utils/assets';

const pathToExtension = path.resolve('.output/chrome-mv3');

/**
 * Chrome拡張機能を読み込んだPlaywrightのBrowserContextを作成する。
 *
 * @param fakeVideoCapture - フェイクカメラの動画のアセット名。
 *   未指定の場合はフェイクカメラは利用しない。
 *
 * @returns テストフィクスチャ用の関数。拡張機能をロードした状態の
 *   BrowserContextを提供し、利用後は自動的にクローズする。
 *
 * @example
 * // フェイクカメラを利用する場合
 * test.use({
 *   context: createExtensionTestContext('qrcode-url-http.y4m')
 * });
 *
 * @example
 * // フェイクカメラを利用しない場合
 * test.use({
 *   context: createExtensionTestContext()
 * });
 */
export function createExtensionTestContext(
  fakeVideoCapture?: Extract<AssetName, `${string}.y4m`>,
) {
  return async ({}, use: (r: BrowserContext) => Promise<void>) => {
    const args = [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
    ];
    if (fakeVideoCapture) {
      args.push(
        '--use-fake-ui-for-media-stream',
        '--use-fake-device-for-media-stream',
        `--use-file-for-fake-video-capture=${getAssetPath(fakeVideoCapture)}`,
      );
    }

    const context = await chromium.launchPersistentContext('', {
      headless: false,
      args,
    });

    await use(context);

    await context.close();
  };
}
