import { Action } from 'redux';

import { ApiResponseStatus } from 'enums/api';

interface LanguagePair {
  fromLang: string;
  toLang: string;
}

export interface TranslatorDetails {
  id: number;
  firstName: string;
  lastName: string;
  languagePairs: Array<LanguagePair>;
  town: string;
  country: string;
}

export interface PublicTranslatorListApiResponse {
  content: Array<TranslatorDetails>;
  numberOfElements: number;
  totalElements: number;
}

export interface TranslatorDetailsState {
  status: ApiResponseStatus;
  translators: Array<TranslatorDetails>;
}
export interface TranslatorDetailsAction extends Action<string> {
  translatorDetails?: Array<TranslatorDetails>;
  error?: Error;
}
