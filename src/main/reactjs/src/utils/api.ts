import {
  APIAuthorisation,
  APIAuthorisationTerm,
  Authorisation,
} from 'interfaces/authorisation';
import { APIMeetingDate } from 'interfaces/meetingDate';

export class APIUtils {
  static convertAPIAuthorisation(
    authorisation: APIAuthorisation
  ): Authorisation {
    return {
      ...authorisation,
      autDate: new Date(authorisation.autDate),
      virDate: new Date(authorisation.virDate),
      assuranceDate: new Date(authorisation.assuranceDate),
      meetingDate: new Date(authorisation.meetingDate),
      terms: APIUtils.convertAPIAuthorisationTerms(authorisation.terms),
    };
  }

  static convertAPIAuthorisationTerms(terms?: Array<APIAuthorisationTerm>) {
    if (terms) {
      return terms.map((t) => {
        const start = new Date(t.beginDate);
        if (t.endDate) {
          return { start, end: new Date(t.endDate) };
        }

        return { start };
      });
    }
  }

  static convertAPIMeetingDate(meetingDate: APIMeetingDate) {
    return {
      ...meetingDate,
      date: new Date(meetingDate.date),
    };
  }
}
