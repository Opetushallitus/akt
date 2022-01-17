import {
  APIAuthorisation,
  APIAuthorisationTerm,
  Authorisation,
  AuthorisationTerm,
  LanguagePair,
} from 'interfaces/authorisation';
import { APIMeetingDate } from 'interfaces/meetingDate';

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

    const [clerkLanguagePair] = authorisation.languagePairs;
    const langPair: LanguagePair = { ...clerkLanguagePair };

    const terms = APIUtils.convertAPIAuthorisationTerms(authorisation.terms);
    const effectiveTerm = effectiveAuthorisationTerm(terms);

    return {
      ...authorisation,
      langPair,
      autDate: new Date(authorisation.autDate),
      virDate: new Date(authorisation.virDate),
      assuranceDate: new Date(authorisation.assuranceDate),
      meetingDate: new Date(authorisation.meetingDate),
      terms,
      effectiveTerm,
      permissionToPublish: clerkLanguagePair.permissionToPublish,
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
