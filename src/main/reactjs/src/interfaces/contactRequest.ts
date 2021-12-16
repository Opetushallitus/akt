import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { LanguagePair } from './translator';

export interface ContactDetails {
  email: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
}

export interface ContactRequest extends ContactDetails {
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
