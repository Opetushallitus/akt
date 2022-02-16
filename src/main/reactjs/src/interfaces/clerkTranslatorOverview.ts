import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

export interface ClerkTranslatorOverviewState {
  status: APIResponseStatus;
  selectedTranslator?: ClerkTranslator;
}

export interface ClerkTranslatorOverviewAction extends Action {
  translator?: ClerkTranslator;
  id?: number;
}
