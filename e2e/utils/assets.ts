import path from 'node:path';

export type AssetName =
  | 'qrcode-text-Dalmatian.png'
  | 'qrcode-text-Dalmatian.y4m'
  | 'qrcode-url-http.png'
  | 'qrcode-url-http.y4m'
  | 'qrcode-url-https.png'
  | 'qrcode-url-https.y4m';

/**
 * `assets` ディレクトリ内に存在するファイルの絶対パスを返す。
 *
 * @param assetName - 取得したいアセットファイル名
 * @returns ファイルの絶対パス
 *
 * @example
 * ```
 * const filePath = getAssetPath('qrcode-url-http.png');
 * console.log(filePath);
 * // => /absolute/path/to/project/assets/qrcode-url-http.png
 * ```
 */
export function getAssetPath(assetName: AssetName) {
  return path.resolve(import.meta.dirname, `../assets/${assetName}`);
}
