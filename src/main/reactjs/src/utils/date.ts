import { getCurrentLang, supportedLangs } from 'configs/i18n';
import { AppLanguage } from 'enums/app';

const getDateTimeFormatter = (lang: AppLanguage) => {
  const locale = supportedLangs.includes(lang) ? lang : 'fi-FI';

  return new Intl.DateTimeFormat(locale);
};

export class DateUtils {
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

  static isDatePartBeforeOrEqual(before: Date, after: Date) {
    // Compare years
    if (before.getFullYear() < after.getFullYear()) {
      return true;
    } else if (before.getFullYear() > after.getFullYear()) {
      return false;
    }
    // Equal years, compare months
    if (before.getMonth() < after.getMonth()) {
      return true;
    } else if (before.getMonth() > after.getMonth()) {
      return false;
    }

    // Equal months, finally compare dates
    return before.getDate() <= after.getDate();
  }
}
