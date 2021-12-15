import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  TranslatorDetailsState,
  TranslatorDetailsAction,
  TranslatorDetails,
  LanguagePairsDict,
} from 'interfaces/translator';
import {
  TRANSLATOR_DETAILS_ERROR,
  TRANSLATOR_DETAILS_LOADING,
  TRANSLATOR_DETAILS_RECEIVED,
  TRANSLATOR_DETAILS_ADD_SELECTED,
  TRANSLATOR_DETAILS_REMOVE_SELECTED,
  TRANSLATOR_DETAILS_ADD_FILTERS,
  TRANSLATOR_DETAILS_EMPTY_FILTERS,
} from 'redux/actionTypes/translatorDetails';

const defaultState = {
  status: APIResponseStatus.NotLoaded,
  selectedTranslators: [],
  translators: [],
  filters: {
    fromLang: '',
    toLang: '',
    name: '',
    town: '',
  },
  langs: { from: [], to: [] },
  towns: [],
};

export const translatorDetailsReducer: Reducer<
  TranslatorDetailsState,
  TranslatorDetailsAction
> = (state = defaultState, action) => {
  const index = action.index as number;

  switch (action.type) {
    case TRANSLATOR_DETAILS_LOADING:
      return {
        ...state,
        status: APIResponseStatus.Loading,
      };
    case TRANSLATOR_DETAILS_RECEIVED:
      return {
        ...state,
        status: APIResponseStatus.Loaded,
        translators: <Array<TranslatorDetails>>action.translators,
        langs: <LanguagePairsDict>action.langs,
        towns: <Array<string>>action.towns,
      };
    case TRANSLATOR_DETAILS_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    case TRANSLATOR_DETAILS_ADD_SELECTED:
      return {
        ...state,
        selectedTranslators: [...state.selectedTranslators, index],
      };
    case TRANSLATOR_DETAILS_REMOVE_SELECTED:
      return {
        ...state,
        selectedTranslators: state.selectedTranslators.filter(
          (idx) => idx !== index
        ),
      };
    case TRANSLATOR_DETAILS_ADD_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
      };
    case TRANSLATOR_DETAILS_EMPTY_FILTERS:
      return {
        ...state,
        filters: { ...defaultState.filters },
      };
    default:
      return state;
  }
};
