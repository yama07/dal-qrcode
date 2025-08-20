/**
 * Data URLをBlobオブジェクトに変換します。
 *
 * @param dataUrl - Data UR 形式の文字列
 * @returns 変換されたBlobオブジェクト
 *
 * @example
 * ```
 * const blob = convertDataUrlToBlob('data:image/png;base64,...');
 * ```
 */
export function convertDataUrlToBlob(dataUrl: string): Blob {
  const base64 = dataUrl.split(',')[1];
  const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  return new Blob([byteArray], { type: mimeString });
}

/**
 * Data URLを指定したファイル名で保存します。
 *
 * @param dataUrl - 保存する対象のData URL
 * @param fileName - 保存時のファイル名
 *
 * @example
 * ```
 * saveDataUrlAsFile('data:image/png;base64,...', 'qr.png');
 * ```
 */
export function saveDataUrlAsFile(dataUrl: string, fileName: string): void {
  const blob = convertDataUrlToBlob(dataUrl);

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(link.href);
}

/**
 * コンテンツをクリップボードにコピーします。
 *
 * - `type: 'text'`の場合は、コンテンツを文字列としてコピーします。
 * - `type: 'image'`の場合は、コンテンツをData URLとしてパースし、画像としてコピーします。
 *
 * @param content - コピーする内容（テキストまた Data URL）
 * @param type - コピーするデータの種類（`'text'`または`'image'`）
 * @returns Promise<void>
 *
 * @example
 * ```
 * // テキストをコピー
 * await copyToClipboard('Hello World', 'text');
 *
 * // 画像をコピー
 * await copyToClipboard('data:image/png;base64,...', 'image');
 * ```
 */
export async function copyToClipboard(
  content: string,
  type: 'text' | 'image',
): Promise<void> {
  if (type === 'text') {
    await navigator.clipboard.writeText(content);
  } else {
    const blob = convertDataUrlToBlob(content);
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  }
}

/**
 * 文字列がブラウザでアクセス可能なURLかどうかを判定します。
 *
 * @param value - 検証対象の文字列
 * @returns `http`または`https`プロトコルのURLなら`true`、それ以外は`false`
 *
 * @example
 * ```
 * isBrowsableUrl('http://example.com'); // true
 * isBrowsableUrl('https://example.com'); // true
 * isBrowsableUrl('ftp://example.com');    // false
 * isBrowsableUrl('not a url');            // false
 * ```
 */
export function isBrowsableUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch (error) {
    return false;
  }
}
