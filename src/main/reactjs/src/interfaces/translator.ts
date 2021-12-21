import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { WithId } from 'interfaces/withId';

export interface LanguagePair {
  from: string;
  to: string;
}

export interface PublicTranslator extends WithId {
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

export interface LanguagePairsDict {
  from: Array<string>;
  to: Array<string>;
}

export interface PublicTranslatorResponse {
  translators: Array<PublicTranslator>;
  langs: LanguagePairsDict;
  towns: string[];
}

export interface PublicTranslatorState extends PublicTranslatorResponse {
  status: APIResponseStatus;
  selectedTranslators: Array<number>;
  filters: PublicTranslatorFilter;
}

export interface PublicTranslatorAction
  extends Action<string>,
    Partial<PublicTranslatorResponse> {
  index?: number;
  filters?: PublicTranslatorFilter;
  error?: Error;
}
