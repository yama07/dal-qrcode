import { describe, it, expect } from 'vitest';
import enMessages from '../../public/_locales/en/messages.json' with { type: 'json' };
import jaMessages from '../../public/_locales/ja/messages.json' with { type: 'json' };

describe('i18n messages', () => {
  const enKeys = Object.keys(enMessages);
  const jaKeys = Object.keys(jaMessages);

  it('enの全てのキーに"message"が存在する', () => {
    const noMessages = Object.entries(enMessages).filter(
      ([_, obj]) => typeof obj !== 'object' || !('message' in obj),
    );
    expect(noMessages).toEqual([]);
  });

  it('jaの全てのキーに"message"が存在する', () => {
    const noMessages = Object.entries(jaMessages).filter(
      ([_, obj]) => typeof obj !== 'object' || !('message' in obj),
    );
    expect(noMessages).toEqual([]);
  });

  it('enのキーが全てjaに存在する', () => {
    const missingInJa = enKeys.filter((key) => !(key in jaMessages));
    expect(missingInJa).toEqual([]);
  });

  it('jaのキーが全てenに存在する', () => {
    const missingInEn = jaKeys.filter((key) => !(key in enMessages));
    expect(missingInEn).toEqual([]);
  });
});
