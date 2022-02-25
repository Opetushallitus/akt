import { Authorisation } from 'interfaces/authorisation';
import { DateUtils } from 'utils/date';

export class AuthorisationUtils {
  static isAuthorisationEffective(
    { effectiveTerm }: Authorisation,
    currentDate: Date
  ) {
    if (effectiveTerm && effectiveTerm.end) {
      return DateUtils.isDatePartBeforeOrEqual(currentDate, effectiveTerm.end);
    } else if (effectiveTerm) {
      return true;
    } else {
      return false;
    }
  }

  static isAuthorisationExpiring = (
    { effectiveTerm }: Authorisation,
    currentDate: Date,
    expiringThreshold: Date
  ) => {
    if (effectiveTerm && effectiveTerm.end) {
      return (
        DateUtils.isDatePartBeforeOrEqual(currentDate, effectiveTerm.end) &&
        DateUtils.isDatePartBeforeOrEqual(effectiveTerm.end, expiringThreshold)
      );
    }

    return false;
  };

  static isAuthorisationExpired(
    { effectiveTerm }: Authorisation,
    currentDate: Date
  ) {
    if (effectiveTerm && effectiveTerm.end) {
      return !DateUtils.isDatePartBeforeOrEqual(currentDate, effectiveTerm.end);
    }

    return false;
  }

  static isAuthorisationForFormerVIR({ effectiveTerm }: Authorisation) {
    return !effectiveTerm;
  }
}
