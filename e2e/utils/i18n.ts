import en_messages from '../../public/_locales/en/messages.json' with { type: 'json' };
import ja_messages from '../../public/_locales/ja/messages.json' with { type: 'json' };

type MessageKey = keyof typeof en_messages & keyof typeof ja_messages;
type Messages = { [key in MessageKey]: { message: string } };

/**
 * 指定されたロケールから、指定されたキーのメッセージ文字列を取得します。
 *
 * @param key - 取得したいメッセージのキー (例: `"extName"`)
 * @param locale - 使用するロケール (`"ja-JP"` または `"en-US"`。それ以外の場合は`"en-US"`にフォールバック)
 * @returns 指定されたキーに対応するメッセージ文字列
 *
 * @throws {Error} 指定したキーに対するメッセージ文字列が存在しない場合
 * ```
 */
export function getMessage(key: MessageKey, locale?: string): string {
  const messages = (
    locale?.startsWith('ja') ? ja_messages : en_messages
  ) as Messages;

  const message = messages[key]?.message;

  if (!message) {
    throw new Error(`Message for key "${key}" not found in locale "${locale}"`);
  }

  return message;
}
