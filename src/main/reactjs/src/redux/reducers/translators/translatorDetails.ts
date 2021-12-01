import { Action, Reducer } from 'redux';

import { TranslatorDetails } from 'interfaces/translator';
import { ApiResponseStatus } from 'enums/api';
import {
  TRANSLATOR_DETAILS_ERROR,
  TRANSLATOR_DETAILS_LOADING,
  TRANSLATOR_DETAILS_RECEIVED,
} from 'redux/actionTypes/translatorDetails';

interface TranslatorDetailsState {
  status: ApiResponseStatus;
  allTranslators: Array<TranslatorDetails>;
}

interface TranslatorDetailsAction extends Action<string> {
  translatorDetails?: Array<TranslatorDetails>;
  error?: Error;
}

export const translatorDetailsReducer: Reducer<
  TranslatorDetailsState,
  TranslatorDetailsAction
> = (
  state = { status: ApiResponseStatus.NotLoaded, allTranslators: [] },
  action
) => {
  switch (action.type) {
    case TRANSLATOR_DETAILS_LOADING:
      return { status: ApiResponseStatus.Loading, allTranslators: [] };
    case TRANSLATOR_DETAILS_RECEIVED:
      return {
        status: ApiResponseStatus.Loaded,
        allTranslators: action.translatorDetails as Array<TranslatorDetails>,
      };
    case TRANSLATOR_DETAILS_ERROR:
      return { status: ApiResponseStatus.Error, allTranslators: [] };
    default:
      return state;
  }
};
