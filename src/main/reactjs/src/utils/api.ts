import { APIError } from 'enums/api';
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
    const autDate = stringToDate(authorisation.autDate);

    return {
      ...authorisation,
      termBeginDate,
      termEndDate,
      autDate,
    };
  }

  static convertMeetingDateResponse(meetingDate: MeetingDateResponse) {
    const dayjs = DateUtils.dayjs();

    return {
      ...meetingDate,
      date: dayjs(meetingDate.date),
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

  static convertAuthorisationToAPIRequest(authorisation: Authorisation) {
    const { from, to } = authorisation.languagePair;
    const {
      basis,
      termBeginDate,
      termEndDate,
      autDate,
      permissionToPublish,
      diaryNumber,
    } = authorisation;

    return {
      from,
      to,
      basis,
      termBeginDate: DateUtils.convertToAPIRequestDateString(termBeginDate),
      termEndDate: DateUtils.convertToAPIRequestDateString(termEndDate),
      autDate: DateUtils.convertToAPIRequestDateString(autDate),
      permissionToPublish,
      diaryNumber,
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static getAPIError(error: any): string | undefined {
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.errorCode
    ) {
      const code = error.response.data.errorCode;

      return Object.values(APIError)[code];
    }
  }
}
