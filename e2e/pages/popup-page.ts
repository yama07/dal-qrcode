import { Page } from '@playwright/test';
import { Extension } from './extensions-page';
import { getMessage as _getMessage } from '../utils/i18n';

export class PopupPage {
  readonly url: string;
  readonly getMessage: (key: Parameters<typeof _getMessage>[0]) => string;

  constructor(
    public readonly page: Page,
    public readonly extension: Extension,
  ) {
    this.url = `chrome-extension://${extension.id}/popup.html`;
    this.getMessage = (key) => _getMessage(key, this.extension.lang);
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('load');
  }

  async selectGenerateTab() {
    await this.page
      .getByRole('tab', {
        name: this.getMessage('popup__generate_tab'),
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
      name: this.getMessage('popup_generate__copy_button'),
    });
  }

  getDownloadButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('popup_generate__download_button'),
    });
  }

  getAlert() {
    return this.page.getByRole('alert');
  }

  async selectScanTab() {
    await this.page
      .getByRole('tab', {
        name: this.getMessage('popup__scan_tab'),
      })
      .click();
  }

  getScanFromImageButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('popup_scan__scanFromImage_button'),
    });
  }

  getScanWithImageButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('popup_scan__scanWithCamera_button'),
    });
  }
}
