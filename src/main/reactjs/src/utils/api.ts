import {
  APIAuthorisation,
  APIAuthorisationTerm,
  Authorisation,
  AuthorisationTerm,
} from 'interfaces/authorisation';
import { APIMeetingDate } from 'interfaces/meetingDate';
import { DateUtils } from 'utils/date';

export class APIUtils {
  static convertAPIAuthorisation(
    authorisation: APIAuthorisation
  ): Authorisation {
    const effectiveAuthorisationTerm = (terms?: Array<AuthorisationTerm>) => {
      const comparator = (a: AuthorisationTerm, b: AuthorisationTerm) => {
        return a.start > b.start ? -1 : 1;
      };

      if (terms && terms.length > 0) {
        const copiedTerms = [...terms];
        copiedTerms.sort(comparator);

        return copiedTerms[0];
      }
    };

    const stringToDate = DateUtils.optionalStringToDate;

    const autDate = stringToDate(authorisation.autDate);
    const virDate = stringToDate(authorisation.virDate);
    const assuranceDate = stringToDate(authorisation.assuranceDate);
    const meetingDate = stringToDate(authorisation.meetingDate);

    const terms = APIUtils.convertAPIAuthorisationTerms(authorisation.terms);
    const effectiveTerm = effectiveAuthorisationTerm(terms);

    return {
      ...authorisation,
      autDate,
      virDate,
      assuranceDate,
      meetingDate,
      effectiveTerm,
      terms,
    };
  }

  static convertAPIAuthorisationTerms(terms?: Array<APIAuthorisationTerm>) {
    if (terms) {
      return terms.map((term) => {
        const start = new Date(term.beginDate);

        if (term.endDate) {
          return {
            ...term,
            start,
            end: new Date(term.endDate),
          };
        }

        return { ...term, start };
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
