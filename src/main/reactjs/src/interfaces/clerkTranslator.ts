import { PermissionToPublish } from 'enums/app';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import {
  Authorisation,
  AuthorisationBasis,
  AuthorisationResponse,
} from 'interfaces/authorisation';
import { ClerkTranslatorTextField } from 'interfaces/clerkTranslatorTextField';
import { WithId, WithVersion } from 'interfaces/with';

export interface ClerkTranslatorBasicInformation
  extends ClerkTranslatorTextField {
  isAssuranceGiven: boolean;
}

export interface ClerkTranslatorResponse
  extends ClerkTranslatorBasicInformation,
    WithId,
    WithVersion {
  authorisations: Array<AuthorisationResponse>;
}

export interface ClerkTranslator
  extends Omit<ClerkTranslatorResponse, 'authorisations'> {
  authorisations: Array<Authorisation>;
}

export interface ClerkTranslatorFilter {
  fromLang?: string;
  toLang?: string;
  name?: string;
  authorisationStatus: AuthorisationStatus;
  authorisationBasis?: AuthorisationBasis;
  permissionToPublish?: keyof typeof PermissionToPublish;
}
