import { Page } from '@playwright/test';
import { Extension } from './extensions-page';
import { getMessage as _getMessage } from '../utils/i18n';

export class ScanCameraPage {
  readonly url: string;
  readonly getMessage: (key: Parameters<typeof _getMessage>[0]) => string;

  constructor(
    public readonly page: Page,
    public readonly extension: Extension,
  ) {
    this.url = `chrome-extension://${extension.id}/scan-camera.html`;
    this.getMessage = (key) => _getMessage(key, this.extension.lang);
  }

  async goto() {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('load');
  }

  getStartButton() {
    return this.page.getByRole('button', {
      name: this.getMessage('scanWithCamera__start_button'),
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
