import { TFunction } from 'i18next';

import {
  NotifierSeverity,
  NotifierTypes,
  TextBoxErrors,
  TextBoxTypes,
} from 'enums/app';
import { Notifier, NotifierButtonAction } from 'interfaces/notifier';

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

  static createUniqueId() {
    const date = new Date().getTime().toString(36);
    const random = Math.random().toString(26).slice(2);

    return `${date}-${random}`;
  }

  static createNotifierDialog(
    title: string,
    type: NotifierTypes,
    severity: NotifierSeverity,
    description: string,
    actions: NotifierButtonAction[],
    timeOut: number | undefined = undefined
  ) {
    const notifier: Notifier = {
      id: Utils.createUniqueId(),
      title,
      type,
      severity,
      description,
      actions,
      timeOut,
    };

    return notifier;
  }

  static createNotifierToast(
    title: string,
    type: NotifierTypes,
    severity: NotifierSeverity,
    description: string,
    timeOut: number | undefined = 6000
  ) {
    const notifier: Notifier = {
      id: Utils.createUniqueId(),
      title,
      type,
      severity,
      description,
      actions: [],
      timeOut,
    };

    return notifier;
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
