import dayjs from 'dayjs';

import { getCurrentLang } from 'configs/i18n';

export class DateUtils {
  static dayjs() {
    dayjs.locale(getCurrentLang());

    return dayjs;
  }

  static formatOptionalDate(date?: dayjs.Dayjs) {
    if (!date) {
      return '-';
    }

    return date.format('D.M.YYYY');
  }

  static optionalStringToDate(dateString?: string) {
    if (dateString) {
      const dayjs = DateUtils.dayjs();

      return dayjs(dateString);
    }
  }

  static isDatePartBefore(before: dayjs.Dayjs, after: dayjs.Dayjs) {
    return before.isBefore(after, 'day');
  }

  static isDatePartEqual(before: dayjs.Dayjs, after: dayjs.Dayjs) {
    return before.isSame(after, 'day');
  }

  static isDatePartBeforeOrEqual(before: dayjs.Dayjs, after: dayjs.Dayjs) {
    return (
      this.isDatePartBefore(before, after) ||
      this.isDatePartEqual(before, after)
    );
  }
}
