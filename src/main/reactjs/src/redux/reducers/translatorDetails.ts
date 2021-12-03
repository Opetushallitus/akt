import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  TranslatorDetails,
  TranslatorDetailsState,
  TranslatorDetailsAction,
} from 'interfaces/translator';
import {
  TRANSLATOR_DETAILS_ERROR,
  TRANSLATOR_DETAILS_LOADING,
  TRANSLATOR_DETAILS_RECEIVED,
} from 'redux/actionTypes/translatorDetails';

const defaultState = { status: APIResponseStatus.NotLoaded, translators: [] };

export const translatorDetailsReducer: Reducer<
  TranslatorDetailsState,
  TranslatorDetailsAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case TRANSLATOR_DETAILS_LOADING:
      return { status: APIResponseStatus.Loading, translators: [] };
    case TRANSLATOR_DETAILS_RECEIVED:
      return {
        status: APIResponseStatus.Loaded,
        translators: action.translatorDetails as Array<TranslatorDetails>,
      };
    case TRANSLATOR_DETAILS_ERROR:
      return { status: APIResponseStatus.Error, translators: [] };
    default:
      return state;
  }
};
