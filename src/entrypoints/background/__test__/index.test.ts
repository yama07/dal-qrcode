import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fakeBrowser } from 'wxt/testing';

import background from '../index';
import { contextData } from '$lib/utils/storage';

describe('Background Entrypoint', () => {
  let contextMenuClickedListener: any;

  beforeEach(async () => {
    fakeBrowser.reset();
    await contextData.removeValue();

    // Mock contextMenus.onClicked.addListener to store the listener
    contextMenuClickedListener = null;
    fakeBrowser.contextMenus.onClicked.addListener = vi.fn((callback) => {
      contextMenuClickedListener = callback;
    });

    // Mock contextMenus.create
    fakeBrowser.contextMenus.create = vi.fn();

    // Mock i18n.getMessage
    fakeBrowser.i18n.getMessage = vi.fn(() => '');

    // Mock browser.action.openPopup
    const openPopupMock = vi.fn();
    fakeBrowser.action.openPopup = openPopupMock;
  });

  it('インストール時にコンテキストメニューが登録される', async () => {
    background.main();
    await fakeBrowser.runtime.onInstalled.trigger();

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

  it('コンテキストメニュー「URLからQRコードを生成」をクリックすると、コンテキストデータがストレージにセットされてポップアップが開く', async () => {
    background.main();

    // Call the stored listener directly
    contextMenuClickedListener({
      menuItemId: 'generate_from_link',
      linkUrl: 'https://example.com',
    });

    expect(await contextData.getValue()).toEqual({
      action: 'generate',
      data: 'https://example.com',
    });
    expect(fakeBrowser.action.openPopup).toHaveBeenCalled();
  });

  it('コンテキストメニュー「選択したテキストからQRコードを生成」をクリックすると、コンテキストデータがストレージにセットされてポップアップが開く', async () => {
    background.main();

    // Call the stored listener directly
    contextMenuClickedListener({
      menuItemId: 'generate_from_selection',
      selectionText: 'bow wow',
    });

    expect(await contextData.getValue()).toEqual({
      action: 'generate',
      data: 'bow wow',
    });
    expect(fakeBrowser.action.openPopup).toHaveBeenCalled();
  });
});
