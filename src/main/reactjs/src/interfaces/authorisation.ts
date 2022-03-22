import { Dayjs } from 'dayjs';
import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
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
export interface AddAuthorisation {
  languagePair: LanguagePair;
  basis: AuthorisationBasis;
  termBeginDate?: Dayjs;
  termEndDate?: Dayjs;
  permissionToPublish: boolean;
  diaryNumber?: string;
  autDate?: Dayjs;
  translatorId: number;
}

export interface AddAuthorisationState {
  status: APIResponseStatus;
  authorisation: AddAuthorisation | Record<string, never>;
}

export interface AddAuthorisationAction extends Action {
  authorisation: AddAuthorisation;
}
