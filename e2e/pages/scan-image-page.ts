import { Page } from '@playwright/test';
import { Extension } from './extensions-page';
import { getMessage as _getMessage } from '../utils/i18n';
import { dragAndDrop } from '../utils/drag-and-drop';

export class ScanImagePage {
  readonly url: string;
  readonly getMessage: (key: Parameters<typeof _getMessage>[0]) => string;

  constructor(
    public readonly page: Page,
    public readonly extension: Extension,
  ) {
    this.url = `chrome-extension://${this.extension.id}/scan-image.html`;
    this.getMessage = (key) => _getMessage(key, this.extension.lang);
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('load');
  }

  async setImageFile(path: string) {
    await this.page.locator('input[type="file"]').setInputFiles(path);
  }

  async setImageFileWithDragAndDrop(path: string) {
    await dragAndDrop(
      this.page,
      this.page.getByLabel(this.getMessage('scanFromImage__dropzone_label')),
      path,
      'qrcode-text-Dalmatian.png',
      'image/png',
    );
  }

  getScanButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('scanFromImage__scan_button'),
    });
  }

  getResultTextarea() {
    return this.page.getByRole('textbox');
  }

  getOpenUrlButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('scanWithCamera__openUrl_button'),
    });
  }

  getCopyButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('scanWithCamera__copy_button'),
    });
  }

  getAlert() {
    return this.page.getByRole('alert');
  }
}
