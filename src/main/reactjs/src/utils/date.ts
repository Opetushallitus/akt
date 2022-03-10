import dayjs from 'dayjs';

import { getCurrentLang, supportedLangs } from 'configs/i18n';
import { AppLanguage } from 'enums/app';

const getDateTimeFormatter = (lang: AppLanguage) => {
  const locale = supportedLangs.includes(lang) ? lang : AppLanguage.Finnish;

  return new Intl.DateTimeFormat(locale);
};

export class DateUtils {
  static dayjs() {
    dayjs.locale(getCurrentLang());

    return dayjs;
  }

  static formatOptionalDate(date?: Date) {
    if (!date) {
      return '-';
    }

    const lang = getCurrentLang() as AppLanguage;
    const dateTimeFormatter = getDateTimeFormatter(lang);

    return dateTimeFormatter.format(date);
  }

  static optionalStringToDate(dateString?: string) {
    if (dateString) {
      return DateUtils.dateAtStartOfDay(new Date(dateString));
    }
  }

  static dateAtStartOfDay(date: Date) {
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      0,
      0,
      0,
      0
    );
  }

  static isDatePartBefore(before: Date, after: Date) {
    return dayjs(before).isBefore(after, 'day');
  }

  static isDatePartEqual(before: Date, after: Date) {
    return dayjs(before).isSame(after, 'day');
  }

  static isDatePartBeforeOrEqual(before: Date, after: Date) {
    return (
      this.isDatePartBefore(before, after) ||
      this.isDatePartEqual(before, after)
    );
  }
}
