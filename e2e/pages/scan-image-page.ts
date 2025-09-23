import { Page } from '@playwright/test';
import { Extension } from './extensions-page';
import { getMessage } from '../utils/i18n';
import { dragAndDrop } from '../utils/drag-and-drop';

export class ScanImagePage {
  readonly url: string;

  constructor(
    public readonly page: Page,
    public readonly extension: Extension,
  ) {
    this.url = `chrome-extension://${this.extension.id}/scan-image.html`;
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
      this.page.getByLabel(
        getMessage('scanFromImage__dropzone_label', this.extension.lang),
      ),
      path,
      'qrcode-text-Dalmatian.png',
      'image/png',
    );
  }

  getScanButton() {
    return this.page.getByRole('button', {
      name: getMessage('scanFromImage__scan_button', this.extension.lang),
    });
  }

  getResultTextarea() {
    return this.page.getByRole('textbox');
  }

  getOpenUrlButton() {
    return this.page.getByRole('button', {
      name: getMessage('scanWithCamera__openUrl_button', this.extension.lang),
    });
  }

  getCopyButton() {
    return this.page.getByRole('button', {
      name: getMessage('scanWithCamera__copy_button', this.extension.lang),
    });
  }
}
