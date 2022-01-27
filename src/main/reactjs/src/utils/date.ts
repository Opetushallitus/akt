const dateFormatter = new Intl.DateTimeFormat();

export class DateUtils {
  static formatOptionalDate(date?: Date) {
    if (!date) {
      return '-';
    }

    return dateFormatter.format(date);
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
