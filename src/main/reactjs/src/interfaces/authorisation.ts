import { ClerkLanguagePair, PublicLanguagePair } from 'interfaces/language';

type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';

export interface AuthorisationTerm {
  start: Date;
  end?: Date;
}

export interface Authorisation {
  langPair: PublicLanguagePair;
  basis: AuthorisationBasis;
  autDate?: Date;
  kktCheck?: string;
  virDate?: Date;
  assuranceDate?: Date;
  meetingDate?: Date;
  effectiveTerm?: AuthorisationTerm;
  terms?: Array<AuthorisationTerm>;
  permissionToPublish: boolean;
}

export interface APIAuthorisationTerm {
  beginDate: string;
  endDate?: string;
}

export interface APIAuthorisation {
  basis: AuthorisationBasis;
  autDate?: string;
  kktCheck?: string;
  virDate?: string;
  assuranceDate?: string;
  meetingDate?: string;
  terms?: Array<APIAuthorisationTerm>;
  languagePairs: Array<ClerkLanguagePair>;
}
