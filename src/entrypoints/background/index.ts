import { contextData } from '$lib/utils/storage';

export default defineBackground(() => {
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'generate_from_link',
      title: browser.i18n.getMessage('contextMenu__generateFromLink'),
      contexts: ['link'],
    });

    browser.contextMenus.create({
      id: 'generate_from_selection',
      title: browser.i18n.getMessage('contextMenu__generateFromSelection'),
      contexts: ['selection'],
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'generate_from_link') {
      contextData.setValue(
        info.linkUrl ? { action: 'generate', data: info.linkUrl } : null,
      );
      (browser.action ?? browser.browserAction).openPopup();
    } else if (info.menuItemId === 'generate_from_selection') {
      contextData.setValue(
        info.selectionText
          ? { action: 'generate', data: info.selectionText }
          : null,
      );
      (browser.action ?? browser.browserAction).openPopup();
    }
  });
});
