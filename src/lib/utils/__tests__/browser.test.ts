import { describe, it, expect } from 'vitest';
import { convertDataUrlToBlob, isBrowsableUrl } from '../browser';

describe('convertDataUrlToBlob', () => {
  it('Data URLをBlobに変換できること', async () => {
    const dataUrl = 'data:text/plain;base64,SGVsbG8='; // "Hello" in base64

    const blob = convertDataUrlToBlob(dataUrl);

    expect(blob).toBeInstanceOf(Blob);
    expect(blob.type).toBe('text/plain');

    const text = await blob.text();
    expect(text).toBe('Hello');
  });
});

describe('isBrowsableUrl', () => {
  it('http URLの場合は true を返す', () => {
    expect(isBrowsableUrl('http://example.com')).toBe(true);
  });

  it('https URLの場合は true を返す', () => {
    expect(isBrowsableUrl('https://example.com')).toBe(true);
  });

  it('ftp URLの場合は false を返す', () => {
    expect(isBrowsableUrl('ftp://example.com')).toBe(false);
  });

  it('スキームがない場合は false を返す', () => {
    expect(isBrowsableUrl('www.example.com')).toBe(false);
  });

  it('文字列がURLでない場合は false を返す', () => {
    expect(isBrowsableUrl('not a url')).toBe(false);
  });

  it('空文字列の場合は false を返す', () => {
    expect(isBrowsableUrl('')).toBe(false);
  });

  it('ポート番号を含むhttps URL は true を返す', () => {
    expect(isBrowsableUrl('https://example.com:8080/path')).toBe(true);
  });

  it('相対パスは false を返す', () => {
    expect(isBrowsableUrl('/relative/path')).toBe(false);
  });
});
