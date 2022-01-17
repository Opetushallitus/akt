import { ClerkLanguagePair } from 'interfaces/language';

export interface LanguagePair {
  from: string;
  to: string;
}

type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';

export interface AuthorisationTerm {
  start: Date;
  end?: Date;
}

export interface Authorisation {
  langPair: LanguagePair;
  basis: AuthorisationBasis;
  autDate: Date;
  kktCheck: string;
  virDate: Date;
  assuranceDate: Date;
  meetingDate: Date;
  terms?: Array<AuthorisationTerm>;
  effectiveTerm?: AuthorisationTerm;
  permissionToPublish: boolean;
}

export interface APIAuthorisationTerm {
  beginDate: string;
  endDate?: string;
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
