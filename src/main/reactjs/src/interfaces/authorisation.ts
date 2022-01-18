import { LanguagePair } from 'interfaces/language';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';

export interface AuthorisationTerm extends WithId, WithVersion {
  start: Date;
  end?: Date;
}

export interface Authorisation extends WithId, WithVersion {
  languagePair: LanguagePair;
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

export interface APIAuthorisationTerm extends WithId, WithVersion {
  beginDate: string;
  endDate?: string;
}

export interface APIAuthorisation extends WithId, WithVersion {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  autDate?: string;
  kktCheck?: string;
  virDate?: string;
  assuranceDate?: string;
  meetingDate?: string;
  terms?: Array<APIAuthorisationTerm>;
  permissionToPublish: boolean;
}
