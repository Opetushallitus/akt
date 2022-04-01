export class StringUtils {
  /**
   * Value is an empty string if it's undefined, or its length is zero.
   */
  static isEmptyString(value?: string) {
    return !value || value.length === 0;
  }

  /**
   * Value is a blank string if it's undefined, or its trimmed length is zero.
   */
  static isBlankString(value?: string) {
    return !value || value.trim().length === 0;
  }
}
