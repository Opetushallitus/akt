import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

export interface ClerkTranslatorOverviewState {
  overviewStatus: APIResponseStatus;
  translatorDetailsStatus: APIResponseStatus;
  authorisationDetailsStatus: APIResponseStatus;
  selectedTranslator?: ClerkTranslator;
}

export interface ClerkTranslatorOverviewAction extends Action {
  translator?: ClerkTranslator;
  id?: number;
}

export interface AuthorisationAction extends Action {
  id?: number;
  version?: number;
  permissionToPublish?: boolean;
}
