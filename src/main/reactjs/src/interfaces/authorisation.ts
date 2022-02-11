import { PermissionToPublish } from 'enums/app';
import { LanguagePair } from 'interfaces/language';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

export type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';
export type PermissionToPublishBasis = PermissionToPublish;

export interface AuthorisationTerm extends WithId, WithVersion {
  start: Date;
  end?: Date;
}

export interface Authorisation
  extends Omit<
    APIAuthorisation,
    'autDate' | 'virDate' | 'assuranceDate' | 'meetingDate' | 'terms'
  > {
  autDate?: Date;
  virDate?: Date;
  assuranceDate?: Date;
  meetingDate?: Date;
  effectiveTerm?: AuthorisationTerm;
  terms?: Array<AuthorisationTerm>;
}

export interface APIAuthorisationTerm extends WithId, WithVersion {
  beginDate: string;
  endDate?: string;
}

export interface APIAuthorisation extends WithId, WithVersion {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  diaryNumber: string;
  autDate?: string;
  kktCheck?: string;
  virDate?: string;
  assuranceDate?: string;
  meetingDate?: string;
  terms?: Array<APIAuthorisationTerm>;
  permissionToPublish: boolean;
}
