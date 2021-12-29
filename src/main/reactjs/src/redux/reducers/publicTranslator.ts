import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  PublicTranslatorState,
  PublicTranslatorAction,
  PublicTranslator,
  LanguagePairsDict,
} from 'interfaces/translator';
import {
  PUBLIC_TRANSLATOR_ERROR,
  PUBLIC_TRANSLATOR_LOADING,
  PUBLIC_TRANSLATOR_RECEIVED,
  PUBLIC_TRANSLATOR_ADD_SELECTED,
  PUBLIC_TRANSLATOR_REMOVE_SELECTED,
  PUBLIC_TRANSLATOR_ADD_FILTERS,
  PUBLIC_TRANSLATOR_EMPTY_FILTERS,
} from 'redux/actionTypes/publicTranslator';

const defaultState = {
  status: APIResponseStatus.NotStarted,
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

export const publicTranslatorReducer: Reducer<
  PublicTranslatorState,
  PublicTranslatorAction
> = (state = defaultState, action) => {
  const index = action.index as number;

  switch (action.type) {
    case PUBLIC_TRANSLATOR_LOADING:
      return {
        ...state,
        status: APIResponseStatus.InProgress,
      };
    case PUBLIC_TRANSLATOR_RECEIVED:
      return {
        ...state,
        status: APIResponseStatus.Success,
        translators: <Array<PublicTranslator>>action.translators,
        langs: <LanguagePairsDict>action.langs,
        towns: <Array<string>>action.towns,
      };
    case PUBLIC_TRANSLATOR_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    case PUBLIC_TRANSLATOR_ADD_SELECTED:
      return {
        ...state,
        selectedTranslators: [...state.selectedTranslators, index],
      };
    case PUBLIC_TRANSLATOR_REMOVE_SELECTED:
      return {
        ...state,
        selectedTranslators: state.selectedTranslators.filter(
          (idx) => idx !== index
        ),
      };
    case PUBLIC_TRANSLATOR_ADD_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.filters },
      };
    case PUBLIC_TRANSLATOR_EMPTY_FILTERS:
      return {
        ...state,
        filters: { ...defaultState.filters },
      };
    default:
      return state;
  }
};
