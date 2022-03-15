import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { Authorisation } from 'interfaces/authorisation';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

export interface ClerkNewTranslator
  extends Omit<ClerkTranslator, 'id' | 'version' | 'authorisations'> {
  authorisations: Array<Authorisation>;
}

export interface ClerkNewTranslatorState {
  status: APIResponseStatus;
  translator: ClerkNewTranslator;
  createdTranslatorId?: number;
}

export interface ClerkNewTranslatorAction extends Action {
  translator?: ClerkNewTranslator;
  createdTranslatorId?: number;
}
