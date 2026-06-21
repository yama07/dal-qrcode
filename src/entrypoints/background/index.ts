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

    browser.contextMenus.create({
      id: 'scan_from_image',
      title: browser.i18n.getMessage('contextMenu__scanFromImage'),
      contexts: ['image'],
    });
  });

  function openGenPopup(text: string) {
    const params = new URLSearchParams({ text });
    const action = browser.action ?? browser.browserAction;

    action
      .setPopup({ popup: `popup.html?${params.toString()}` })
      .then(() => action.openPopup())
      .then(() => action.setPopup({ popup: `popup.html` }));
  }

  function openScanImgPage(src: string) {
    const params = new URLSearchParams({ src });

    browser.tabs.create({
      url: `${browser.runtime.getURL('/scan-image.html')}?${params.toString()}`,
      active: true,
    });
  }

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'generate_from_link' && info.linkUrl) {
      openGenPopup(info.linkUrl);
    } else if (
      info.menuItemId === 'generate_from_selection' &&
      info.selectionText
    ) {
      openGenPopup(info.selectionText);
    } else if (
      info.menuItemId === 'scan_from_image' &&
      info.mediaType === 'image' &&
      info.srcUrl
    ) {
      openScanImgPage(info.srcUrl);
    }
  });
});
