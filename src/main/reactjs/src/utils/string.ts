export class StringUtils {
  /**
   * Value is a blank string if it's undefined, or its trimmed length is zero.
   *
   */
  static isBlankString(value?: string) {
    return !value || value.trim().length === 0;
  }
}
