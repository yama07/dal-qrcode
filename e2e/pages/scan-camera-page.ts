import { Page } from '@playwright/test';
import { Extension } from './extensions-page';
import { getMessage } from '../utils/i18n';

export class ScanCameraPage {
  readonly url: string;

  constructor(
    public readonly page: Page,
    public readonly extension: Extension,
  ) {
    this.url = `chrome-extension://${extension.id}/scan-camera.html`;
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('load');
  }

  getStartButton() {
    return this.page.getByRole('button', {
      name: getMessage('scanWithCamera__start_button', this.extension.lang),
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
