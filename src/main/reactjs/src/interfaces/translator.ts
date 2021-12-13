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

export interface PublicTranslatorFilter {
  fromLang: string;
  toLang: string;
  name: string;
  town: string;
}

export interface LanguagePairResponse {
  from: Array<string>;
  to: Array<string>;
}

export interface PublicTranslatorResponse {
  translators: Array<TranslatorDetails>;
  langs: LanguagePairResponse;
  towns: string[];
}

export interface TranslatorDetailsState extends PublicTranslatorResponse {
  status: APIResponseStatus;
  selectedTranslators: Array<number>;
  filters: PublicTranslatorFilter;
}

export interface TranslatorDetailsAction
  extends Action<string>,
    Partial<PublicTranslatorResponse> {
  index?: number;
  filters?: PublicTranslatorFilter;
  error?: Error;
}
