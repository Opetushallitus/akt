import { Action } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { WithId } from 'interfaces/withId';
import { LanguagePairsDict, PublicLanguagePair } from 'interfaces/language';

export interface PublicTranslator extends WithId {
  firstName: string;
  lastName: string;
  town: string;
  country: string;
  languagePairs: Array<PublicLanguagePair>;
}

export interface PublicTranslatorFilter {
  fromLang: string;
  toLang: string;
  name: string;
  town: string;
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
