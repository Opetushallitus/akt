import {
  APIAuthorisation,
  APIAuthorisationTerm,
  Authorisation,
  AuthorisationTerm,
} from 'interfaces/authorisation';
import { PublicLanguagePair } from 'interfaces/language';
import { APIMeetingDate } from 'interfaces/meetingDate';

const convertMaybeDate = (date?: string) => {
  if (date) {
    return new Date(date);
  }
};

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
    const langPair: PublicLanguagePair = { ...clerkLanguagePair };

    const terms = APIUtils.convertAPIAuthorisationTerms(authorisation.terms);
    const effectiveTerm = effectiveAuthorisationTerm(terms);
    const autDate = convertMaybeDate(authorisation.autDate);
    const virDate = convertMaybeDate(authorisation.virDate);
    const assuranceDate = convertMaybeDate(authorisation.assuranceDate);
    const meetingDate = convertMaybeDate(authorisation.meetingDate);
    const permissionToPublish = clerkLanguagePair.permissionToPublish;

    return {
      ...authorisation,
      langPair,
      autDate,
      virDate,
      assuranceDate,
      meetingDate,
      terms,
      effectiveTerm,
      permissionToPublish,
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
