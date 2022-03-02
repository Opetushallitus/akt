import { APIAuthorisation, Authorisation } from 'interfaces/authorisation';
import {
  APIClerkTranslator,
  ClerkTranslator,
} from 'interfaces/clerkTranslator';
import { APIMeetingDate } from 'interfaces/meetingDate';
import { DateUtils } from 'utils/date';

export class APIUtils {
  static convertAPIAuthorisation(
    authorisation: APIAuthorisation
  ): Authorisation {
    const stringToDate = DateUtils.optionalStringToDate;

    const termBeginDate = stringToDate(authorisation.termBeginDate);
    const termEndDate = stringToDate(authorisation.termEndDate);
    const meetingDate = stringToDate(authorisation.meetingDate);
    const autDate = stringToDate(authorisation.autDate);
    const virDate = stringToDate(authorisation.virDate);
    const assuranceDate = stringToDate(authorisation.assuranceDate);

    return {
      ...authorisation,
      termBeginDate,
      termEndDate,
      meetingDate,
      autDate,
      virDate,
      assuranceDate,
    };
  }

  static convertAPIMeetingDate(meetingDate: APIMeetingDate) {
    return {
      ...meetingDate,
      date: DateUtils.dateAtStartOfDay(new Date(meetingDate.date)),
    };
  }

  static convertAPIClerkTranslator(
    translator: APIClerkTranslator
  ): ClerkTranslator {
    return {
      ...translator,
      authorisations: translator.authorisations.map(
        APIUtils.convertAPIAuthorisation
      ),
    };
  }
}
