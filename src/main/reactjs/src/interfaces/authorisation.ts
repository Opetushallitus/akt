import { LanguagePair } from 'interfaces/language';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

export type AuthorisationBasis = 'AUT' | 'KKT' | 'VIR';

export interface Authorisation
  extends Omit<
    AuthorisationResponse,
    'termBeginDate' | 'termEndDate' | 'autDate'
  > {
  termBeginDate?: Date;
  termEndDate?: Date;
  autDate?: Date;
}

export interface AuthorisationResponse extends WithId, WithVersion {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  termBeginDate?: string;
  termEndDate?: string;
  permissionToPublish: boolean;
  diaryNumber?: string;
  autDate?: string;
}
