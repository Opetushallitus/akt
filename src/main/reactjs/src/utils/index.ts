import { TFunction } from 'i18next';

import { TextBoxErrors, TextBoxTypes } from 'enums/app';

export class Utils {
  static isEmptyString(str: string) {
    return !str || str.length === 0;
  }

  static createMapFromArray(
    array: Array<string>,
    t: TFunction | undefined = undefined,
    prefix: string | undefined = undefined
  ) {
    const prfxKey = prefix ? `${prefix}.` : '';

    return new Map(array.map((i) => [t ? `${t(`${prfxKey}${i}`)}` : i, i]));
  }

  static inspectTextBoxErrors(
    type: TextBoxTypes,
    value: string,
    required = true
  ) {
    const MAX_TEXT_LENGTH = 1000;
    const EMAIL_REG_EXR = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const TEL_REG_EXR = /\d{7,14}$/;

    if (required && value.length <= 0) {
      return TextBoxErrors.Required;
    }

    switch (type) {
      case TextBoxTypes.Textarea:
        if (value.length > MAX_TEXT_LENGTH) {
          return TextBoxErrors.MaxLength;
        }
        break;
      case TextBoxTypes.Email:
        if (!value.match(EMAIL_REG_EXR)) {
          return TextBoxErrors.EmailFormat;
        }
        break;
      case TextBoxTypes.PhoneNumber:
        if (value.length > 0 && !value.match(TEL_REG_EXR)) {
          return TextBoxErrors.TelFormat;
        }
        break;
      default:
        return '';
        break;
    }
  }
}
