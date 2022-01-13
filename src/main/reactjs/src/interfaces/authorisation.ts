import { ClerkLanguagePair } from 'interfaces/language';

type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';

export interface AuthorisationTerm {
  start: Date;
  end?: Date;
}

export interface APIAuthorisationTerm {
  beginDate: string;
  endDate?: string;
}

export interface Authorisation {
  basis: AuthorisationBasis;
  autDate: Date;
  kktCheck: string;
  virDate: Date;
  assuranceDate: Date;
  meetingDate: Date;
  terms?: Array<AuthorisationTerm>;
  languagePairs: Array<ClerkLanguagePair>;
}

export interface APIAuthorisation {
  basis: AuthorisationBasis;
  autDate: string;
  kktCheck: string;
  virDate: string;
  assuranceDate: string;
  meetingDate: string;
  terms?: Array<APIAuthorisationTerm>;
  languagePairs: Array<ClerkLanguagePair>;
}

const termsComparator = (a: AuthorisationTerm, b: AuthorisationTerm) => {
  if (!a.end) {
    return -1;
  }
  if (!b.end) {
    return 1;
  }

  return a.end > b.end ? -1 : 1;
};

export const effectiveAuthorisationTerm = (authorisation: Authorisation) => {
  if (authorisation.terms && authorisation.terms.length > 0) {
    const copiedTerms = [...authorisation.terms];
    copiedTerms.sort(termsComparator);

    return copiedTerms[0];
  }

  return null;
};
