import { Authorisation } from 'interfaces/authorisation';
import { DateUtils } from 'utils/date';

export class AuthorisationUtils {
  static isAuthorisationValid(
    { effectiveTerm }: Authorisation,
    currentDate: Date
  ) {
    if (!effectiveTerm || !effectiveTerm.end) {
      return true;
    }

    return DateUtils.isDatePartBeforeOrEqual(currentDate, effectiveTerm.end);
  }
}
