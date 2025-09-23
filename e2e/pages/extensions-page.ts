import { Page } from '@playwright/test';
import { getMessage } from '../utils/i18n';

export type Extension = {
  id: string;
  name: string;
  description: string;
  lang?: string;
};

export class ExtensionsPage {
  constructor(public readonly page: Page) {}

  async getExtensions(): Promise<Extension[]> {
    await this.page.goto('chrome://extensions/');
    await this.page.click('cr-toggle#devMode');

    const extensionCards = await this.page.locator('extensions-item').all();
    const _extensions = await Promise.all(
      extensionCards.map(async (card) => {
        const id = await card.getAttribute('id');
        const name = (await card.locator('#name').textContent())?.trim();
        const description = (
          await card.locator('#description').textContent()
        )?.trim();
        return { id, name, description };
      }),
    );

    const extensions = _extensions.filter(
      (extension): extension is Extension =>
        !!extension.id && !!extension.name && !!extension.description,
    );

    return extensions;
  }

  async getDalQrcodeExtension(): Promise<Extension> {
    const extensions = await this.getExtensions();

    const dalQrcodeExtension = extensions
      .filter(
        (extension) =>
          extension.name === getMessage('extName', 'ja-JP') ||
          extension.name === getMessage('extName', 'en-US'),
      )
      .pop();

    if (!dalQrcodeExtension) {
      throw new Error('The Dal QRcode extension was not found.');
    }

    dalQrcodeExtension.lang =
      dalQrcodeExtension.description === getMessage('extDescription', 'ja-JP')
        ? 'ja-JP'
        : 'en-US';

    return dalQrcodeExtension;
  }
}
