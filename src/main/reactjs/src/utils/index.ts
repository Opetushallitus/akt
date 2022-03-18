import { isValid as isValidFinnishPIC } from 'finnish-personal-identity-code-validator';
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
  static scrollToTop() {
    window.scrollTo({ top: 0, left: 0 });
  }

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

  static getMaxTextAreaLength = () => 6000;

  static EMAIL_REG_EXR = /^.+@.+\..+$/;
  static TEL_REG_EXR = /\d{7,14}$/;

  static inspectCustomTextFieldErrors(
    type: TextFieldTypes,
    value: string,
    required = true
  ) {
    if (required && value.length <= 0) {
      return CustomTextFieldErrors.Required;
    }

    if (!required && value.length == 0) {
      return '';
    }

    switch (type) {
      case TextFieldTypes.Textarea:
        if (value.length > Utils.getMaxTextAreaLength()) {
          return CustomTextFieldErrors.MaxLength;
        }
        break;
      case TextFieldTypes.Email:
        if (!Utils.EMAIL_REG_EXR.test(value)) {
          return CustomTextFieldErrors.EmailFormat;
        }
        break;
      case TextFieldTypes.PhoneNumber:
        if (!Utils.TEL_REG_EXR.test(value)) {
          return CustomTextFieldErrors.TelFormat;
        }
        break;
      case TextFieldTypes.PersonalIdentityCode:
        if (!isValidFinnishPIC(value)) {
          return CustomTextFieldErrors.PersonalIdentityCodeFormat;
        }
        break;
    }

    return '';
  }
}
