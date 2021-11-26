import { Action, Reducer } from 'redux';

import { TranslatorDetails } from 'interfaces/translator';

interface TranslatorDetailsState {
  status: 'NOT_LOADED' | 'LOADING' | 'LOADED' | 'ERROR';
  allTranslators: Array<TranslatorDetails>;
}

interface TranslatorDetailsAction extends Action {
  type: string;
  translatorDetails?: Array<TranslatorDetails>;
  error?: Error;
}

export const translatorDetailsReducer: Reducer<
  TranslatorDetailsState,
  TranslatorDetailsAction
> = (state = { status: 'NOT_LOADED', allTranslators: [] }, action) => {
  switch (action.type) {
    case 'TRANSLATOR_DETAILS/LOADING':
      return { status: 'LOADING', allTranslators: [] };
    case 'TRANSLATOR_DETAILS/RECEIVED':
      return {
        status: 'LOADED',
        allTranslators: action.translatorDetails as Array<TranslatorDetails>,
      };
    case 'TRANSLATOR_DETAILS/ERROR':
      return { status: 'ERROR', allTranslators: [] };
    default:
      return state;
  }
};
