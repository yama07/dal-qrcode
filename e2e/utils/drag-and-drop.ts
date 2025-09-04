import { Locator, Page } from '@playwright/test';
import { readFile } from 'node:fs/promises';

/**
 * 指定した要素に対してファイルのドラッグ＆ドロップ操作をシミュレートする。
 *
 * @param page - 操作を行う対象のページ
 * @param locator - ファイルを「ドロップ」する要素
 * @param filePath - ドロップ対象のローカルファイルのパス
 * @param fileName - ブラウザに認識させるファイル名
 * @param mimeType - ファイルのMIMEタイプ
 *
 * @example
 * ```
 * await dragAndDrop(
 *   page,
 *   page.locator('#upload-area'),
 *   './assets/sample.png',
 *   'sample.png',
 *   'image/png'
 * );
 * ```
 */
export const dragAndDrop = async (
  page: Page,
  locator: Locator,
  filePath: string,
  fileName: string,
  mimeType: string,
) => {
  const inputBuffer = await readFile(filePath);
  const inputDataUrl = `data:${mimeType};base64,${inputBuffer.toString('base64')}`;

  const dataTransfer = await page.evaluateHandle(
    async ({ dataUrl, localFileName, localFileType }) => {
      const blobData = await (await fetch(dataUrl)).blob();
      const file = new File([blobData], localFileName, {
        type: localFileType,
      });

      const dt = new DataTransfer();
      dt.items.add(file);
      return dt;
    },
    {
      dataUrl: inputDataUrl,
      localFileName: fileName,
      localFileType: mimeType,
    },
  );

  await locator.dispatchEvent('drop', { dataTransfer });
};
