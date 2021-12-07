import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';

interface LanguagePair {
  from: string;
  to: string;
}

export interface TranslatorDetails {
  id: number;
  firstName: string;
  lastName: string;
  town: string;
  country: string;
  languagePairs: Array<LanguagePair>;
}

export interface TranslatorDetailsState {
  status: APIResponseStatus;
  translators: Array<TranslatorDetails>;
}
export interface TranslatorDetailsAction extends Action<string> {
  translatorDetails?: Array<TranslatorDetails>;
  error?: Error;
}
