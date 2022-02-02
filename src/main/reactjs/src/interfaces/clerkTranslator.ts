import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { AuthorisationStatus } from 'enums/clerkTranslator';
import {
  APIAuthorisation,
  Authorisation,
  AuthorisationBasis,
} from 'interfaces/authorisation';
import { LanguagePairsDict } from 'interfaces/language';
import { APIMeetingDate, MeetingDate } from 'interfaces/meetingDate';
import { WithId } from 'interfaces/withId';
import { WithVersion } from 'interfaces/withVersion';

export interface ClerkTranslatorContactDetails {
  firstName: string;
  lastName: string;
  email?: string;
  phoneNumber?: string;
  identityNumber?: string;
  street?: string;
  postalCode?: string;
  town?: string;
  country?: string;
}

export interface ClerkTranslator
  extends Omit<APIClerkTranslator, 'authorisations'> {
  authorisations: Array<Authorisation>;
}

export interface ClerkTranslatorResponse {
  translators: Array<ClerkTranslator>;
  langs: LanguagePairsDict;
  towns: Array<string>;
  meetingDates: Array<MeetingDate>;
}

export interface APIClerkTranslator extends WithId, WithVersion {
  contactDetails: ClerkTranslatorContactDetails;
  authorisations: Array<APIAuthorisation>;
}

export interface ClerkTranslatorAPIResponse {
  translators: Array<APIClerkTranslator>;
  langs: LanguagePairsDict;
  towns: Array<string>;
  meetingDates: Array<APIMeetingDate>;
}

export interface ClerkTranslatorAction
  extends Action<string>,
    Partial<ClerkTranslatorResponse> {
  index?: number;
  filters?: ClerkTranslatorFilter;
}

export interface ClerkTranslatorFilter {
  fromLang?: string;
  toLang?: string;
  name?: string;
  town?: string;
  authorisationStatus: AuthorisationStatus;
  authorisationBasis?: AuthorisationBasis;
}

export interface ClerkTranslatorState extends ClerkTranslatorResponse {
  selectedTranslators: Array<number>;
  status: APIResponseStatus;
  filters: ClerkTranslatorFilter;
}
