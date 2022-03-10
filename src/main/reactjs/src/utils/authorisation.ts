import { Authorisation } from 'interfaces/authorisation';
import koodistoLangsFI from 'public/i18n/koodisto/langs/koodisto_langs_fi-FI.json';
import { DateUtils } from 'utils/date';

export class AuthorisationUtils {
  static isAuthorisationEffective(
    { termBeginDate, termEndDate }: Authorisation,
    currentDate: Date
  ) {
    if (termEndDate) {
      return DateUtils.isDatePartBeforeOrEqual(currentDate, termEndDate);
    } else if (termBeginDate) {
      return true;
    } else {
      return false;
    }
  }

  static isAuthorisationExpiring(
    { termEndDate }: Authorisation,
    currentDate: Date,
    expiringThreshold: Date
  ) {
    return (
      termEndDate &&
      DateUtils.isDatePartBeforeOrEqual(currentDate, termEndDate) &&
      DateUtils.isDatePartBeforeOrEqual(termEndDate, expiringThreshold)
    );
  }

  static isAuthorisationExpired(
    { termEndDate }: Authorisation,
    currentDate: Date
  ) {
    return (
      termEndDate &&
      !DateUtils.isDatePartBeforeOrEqual(currentDate, termEndDate)
    );
  }

  static isAuthorisationForFormerVIR({ termBeginDate }: Authorisation) {
    return !termBeginDate;
  }

  static getKoodistoLangKeys() {
    return Object.keys(koodistoLangsFI?.akt?.koodisto?.languages);
  }
}
