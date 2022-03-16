import { Dayjs } from 'dayjs';

import {
  AuthorisationBasisEnum,
  AuthorisationStatus,
} from 'enums/clerkTranslator';
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

export interface AuthorisationResponse
  extends Partial<WithId>,
    Partial<WithVersion> {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  termBeginDate?: string;
  termEndDate?: string;
  permissionToPublish: boolean;
  diaryNumber?: string;
  autDate?: string;
}

export type AuthorisationsGroupedByStatus = {
  [key in AuthorisationStatus]: Array<Authorisation>;
};
