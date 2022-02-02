import { TFunction } from 'i18next';

import {
  CustomTextFieldErrors,
  Duration,
  NotifierTypes,
  Severity,
  TextFieldTypes,
} from 'enums/app';
import { Dialog, NotifierButtonAction, Toast } from 'interfaces/notifier';

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
    severity: Severity,
    description: string,
    actions: NotifierButtonAction[],
    timeOut: number | undefined = undefined
  ) {
    const notifier: Dialog = {
      id: Utils.createUniqueId(),
      type: NotifierTypes.Dialog,
      title,
      severity,
      description,
      actions,
      timeOut,
    };

    return notifier;
  }

  static createNotifierToast(
    severity: Severity,
    description: string,
    timeOut: number | undefined = Duration.Medium
  ) {
    const notifier: Toast = {
      id: Utils.createUniqueId(),
      type: NotifierTypes.Toast,
      severity,
      description,
      actions: [],
      timeOut,
    };

    return notifier;
  }

  static inspectCustomTextFieldErrors(
    type: TextFieldTypes,
    value: string,
    required = true
  ) {
    const MAX_TEXT_LENGTH = 1000;
    const EMAIL_REG_EXR = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const TEL_REG_EXR = /\d{7,14}$/;

    if (required && value.length <= 0) {
      return CustomTextFieldErrors.Required;
    }

    switch (type) {
      case TextFieldTypes.Textarea:
        if (value.length > MAX_TEXT_LENGTH) {
          return CustomTextFieldErrors.MaxLength;
        }
        break;
      case TextFieldTypes.Email:
        if (!value.match(EMAIL_REG_EXR)) {
          return CustomTextFieldErrors.EmailFormat;
        }
        break;
      case TextFieldTypes.PhoneNumber:
        if (value.length > 0 && !value.match(TEL_REG_EXR)) {
          return CustomTextFieldErrors.TelFormat;
        }
        break;
      default:
        return '';
        break;
    }
  }
}
