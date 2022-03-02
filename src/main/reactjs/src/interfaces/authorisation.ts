import { LanguagePair } from 'interfaces/language';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

export type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';

export interface Authorisation
  extends Omit<
    APIAuthorisation,
    | 'termBeginDate'
    | 'termEndDate'
    | 'meetingDate'
    | 'autDate'
    | 'virDate'
    | 'assuranceDate'
  > {
  termBeginDate?: Date;
  termEndDate?: Date;
  meetingDate?: Date;
  autDate?: Date;
  virDate?: Date;
  assuranceDate?: Date;
}

export interface APIAuthorisation extends WithId, WithVersion {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  termBeginDate?: string;
  termEndDate?: string;
  permissionToPublish: boolean;
  diaryNumber: string;
  meetingDate?: string;
  autDate?: string;
  kktCheck?: string;
  virDate?: string;
  assuranceDate?: string;
}
