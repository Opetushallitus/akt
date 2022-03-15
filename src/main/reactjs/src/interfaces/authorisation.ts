import { Dayjs } from 'dayjs';

import {
  AuthorisationBasisEnum,
  AuthorisationStatus,
} from 'enums/clerkTranslator';
import { LanguagePair } from 'interfaces/languagePair';

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

export interface AuthorisationResponse {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  termBeginDate?: string;
  termEndDate?: string;
  permissionToPublish: boolean;
  diaryNumber?: string;
  autDate?: string;
  id?: number;
  version?: number;
}

export type AuthorisationsGroupedByStatus = {
  [key in AuthorisationStatus]: Array<Authorisation>;
};
