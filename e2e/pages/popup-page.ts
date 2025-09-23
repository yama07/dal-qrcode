import { Page } from '@playwright/test';
import { Extension } from './extensions-page';
import { getMessage } from '../utils/i18n';

export class PopupPage {
  readonly url: string;

  constructor(
    public readonly page: Page,
    public readonly extension: Extension,
  ) {
    this.url = `chrome-extension://${extension.id}/popup.html`;
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('load');
  }

  async selectGenerateTab() {
    await this.page
      .getByRole('tab', {
        name: getMessage('popup__generate_tab', this.extension.lang),
      })
      .click();
  }

  getInputTextarea() {
    return this.page.getByRole('textbox');
  }

  getQrcodeImage() {
    return this.page.getByRole('img', { name: 'QR Code' });
  }

  getCopyButton() {
    return this.page.getByRole('button', {
      name: getMessage('popup_generate__copy_button', this.extension.lang),
    });
  }

  getDownloadButton() {
    return this.page.getByRole('button', {
      name: getMessage('popup_generate__download_button', this.extension.lang),
    });
  }

  async selectScanTab() {
    await this.page
      .getByRole('tab', {
        name: getMessage('popup__scan_tab', this.extension.lang),
      })
      .click();
  }

  getScanFromImageButton() {
    return this.page.getByRole('button', {
      name: getMessage('popup_scan__scanFromImage_button', this.extension.lang),
    });
  }

  getScanWithImageButton() {
    return this.page.getByRole('button', {
      name: getMessage(
        'popup_scan__scanWithCamera_button',
        this.extension.lang,
      ),
    });
  }
}
