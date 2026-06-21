import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

import background from '../index';

describe('Background Entrypoint', () => {
  let contextMenuClickedListener: any;

  beforeEach(() => {
    fakeBrowser.reset();

    // Mock contextMenus.onClicked.addListener to store the listener
    contextMenuClickedListener = null;
    fakeBrowser.contextMenus.onClicked.addListener = vi.fn((callback) => {
      contextMenuClickedListener = callback;
    });

    // Mock contextMenus.create
    fakeBrowser.contextMenus.create = vi.fn();

    // Mock i18n.getMessage
    fakeBrowser.i18n.getMessage = vi.fn(() => '');

    // Mock browser.action.setPopup and openPopup
    fakeBrowser.action.setPopup = vi.fn().mockResolvedValue(undefined);
    fakeBrowser.action.openPopup = vi.fn().mockResolvedValue(undefined);
  });

  it('インストール時にコンテキストメニューが登録される', async () => {
    background.main();
    await fakeBrowser.runtime.onInstalled.trigger({
      reason: 'install',
      temporary: false,
    });

    expect(fakeBrowser.contextMenus.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'generate_from_link',
        contexts: ['link'],
      }),
    );

    expect(fakeBrowser.contextMenus.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'generate_from_selection',
        contexts: ['selection'],
      }),
    );
  });

  it('コンテキストメニュー「URLからQRコードを生成」をクリックすると、popup.html にクエリが付いてポップアップが開く', async () => {
    background.main();

    // Call the stored listener directly
    contextMenuClickedListener({
      menuItemId: 'generate_from_link',
      linkUrl: 'https://example.com',
    });

    await vi.waitFor(() => {
      expect(fakeBrowser.action.setPopup).toHaveBeenNthCalledWith(1, {
        popup: 'popup.html?text=https%3A%2F%2Fexample.com',
      });
      expect(fakeBrowser.action.openPopup).toHaveBeenCalledTimes(1);
      expect(fakeBrowser.action.setPopup).toHaveBeenNthCalledWith(2, {
        popup: 'popup.html',
      });
    });
  });

  it('コンテキストメニュー「選択したテキストからQRコードを生成」をクリックすると、popup.html にクエリが付いてポップアップが開く', async () => {
    background.main();

    // Call the stored listener directly
    contextMenuClickedListener({
      menuItemId: 'generate_from_selection',
      selectionText: 'bow wow',
    });

    await vi.waitFor(() => {
      expect(fakeBrowser.action.setPopup).toHaveBeenNthCalledWith(1, {
        popup: 'popup.html?text=bow+wow',
      });
      expect(fakeBrowser.action.openPopup).toHaveBeenCalledTimes(1);
      expect(fakeBrowser.action.setPopup).toHaveBeenNthCalledWith(2, {
        popup: 'popup.html',
      });
    });
  });

  it('コンテキストメニュー「画像からQRコードを読み取る」をクリックすると、scan-image.html にクエリが付いたタブが開く', () => {
    background.main();

    fakeBrowser.tabs.create = vi.fn();

    contextMenuClickedListener({
      menuItemId: 'scan_from_image',
      mediaType: 'image',
      srcUrl: 'https://example.com/image.png',
    });

    expect(fakeBrowser.tabs.create).toHaveBeenCalledWith(
      expect.objectContaining({
        url: expect.stringContaining(
          'scan-image.html?src=https%3A%2F%2Fexample.com%2Fimage.png',
        ),
        active: true,
      }),
    );
  });
});
