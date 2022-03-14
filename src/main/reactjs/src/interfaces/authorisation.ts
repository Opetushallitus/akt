import { Dayjs } from 'dayjs';

import { AuthorisationBasisEnum } from 'enums/clerkTranslator';
import { LanguagePair } from 'interfaces/languagePair';
import { WithId, WithVersion } from 'interfaces/with';

export type AuthorisationBasis = keyof typeof AuthorisationBasisEnum;

export interface Authorisation
  extends Omit<
    AuthorisationResponse,
    'termBeginDate' | 'termEndDate' | 'autDate'
  > {
  termBeginDate?: Dayjs;
  termEndDate?: Dayjs;
  autDate?: Dayjs;
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
