import { Authorisation, AuthorisationResponse } from 'interfaces/authorisation';
import {
  ClerkTranslator,
  ClerkTranslatorResponse,
} from 'interfaces/clerkTranslator';
import { MeetingDateResponse } from 'interfaces/meetingDate';
import { DateUtils } from 'utils/date';

export class APIUtils {
  static convertAuthorisationResponse(
    authorisation: AuthorisationResponse
  ): Authorisation {
    const stringToDate = DateUtils.optionalStringToDate;

    const termBeginDate = stringToDate(authorisation.termBeginDate);
    const termEndDate = stringToDate(authorisation.termEndDate);
    const meetingDate = stringToDate(authorisation.meetingDate);
    const autDate = stringToDate(authorisation.autDate);

    return {
      ...authorisation,
      termBeginDate,
      termEndDate,
      meetingDate,
      autDate,
    };
  }

  static convertMeetingDateResponse(meetingDate: MeetingDateResponse) {
    return {
      ...meetingDate,
      date: DateUtils.dateAtStartOfDay(new Date(meetingDate.date)),
    };
  }

  static convertClerkTranslatorResponse(
    translator: ClerkTranslatorResponse
  ): ClerkTranslator {
    return {
      ...translator,
      authorisations: translator.authorisations.map(
        APIUtils.convertAuthorisationResponse
      ),
    };
  }
}
