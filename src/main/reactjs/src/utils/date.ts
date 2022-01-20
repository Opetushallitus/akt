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
      return new Date(dateString);
    }
  }
}
