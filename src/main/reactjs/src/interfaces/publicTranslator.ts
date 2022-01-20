import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { SearchFilter } from 'enums/app';
import { LanguagePairsDict, LanguagePair } from 'interfaces/language';
import { WithId } from 'interfaces/withId';

export interface PublicTranslator extends WithId {
  firstName: string;
  lastName: string;
  town?: string;
  country?: string;
  languagePairs: Array<LanguagePair>;
}

export interface PublicTranslatorFilter {
  fromLang: string;
  toLang: string;
  name: string;
  town: string;
  errors: Array<SearchFilter>;
}

export interface PublicTranslatorResponse {
  translators: Array<PublicTranslator>;
  langs: LanguagePairsDict;
  towns: Array<string>;
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
  filterErrorName?: SearchFilter;
  error?: Error;
}
