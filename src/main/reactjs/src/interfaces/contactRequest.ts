import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { LanguagePair } from './translator';

export interface ContactRequest {
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  message: string;
  translatorIds: Array<number>;
  languagePair: LanguagePair;
}

export interface ContactRequestState {
  status: APIResponseStatus;
  request?: ContactRequest;
}

export interface ContactRequestAction extends Action {
  request?: ContactRequest;
}
