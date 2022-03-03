import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import {
  ClerkTranslatorOverviewAction,
  ClerkTranslatorOverviewState,
} from 'interfaces/clerkTranslatorOverview';
import {
  CLERK_TRANSLATOR_OVERVIEW_FETCH_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_LOAD,
  CLERK_TRANSLATOR_OVERVIEW_LOADING,
  CLERK_TRANSLATOR_OVERVIEW_RESET_UPDATE,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorOverview';

const defaultState = {
  overviewStatus: APIResponseStatus.NotStarted,
  translatorDetailsStatus: APIResponseStatus.NotStarted,
  authorisationDetailsStatus: APIResponseStatus.NotStarted,
  selectedTranslator: undefined,
};

export const clerkTranslatorOverviewReducer: Reducer<
  ClerkTranslatorOverviewState,
  ClerkTranslatorOverviewAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case CLERK_TRANSLATOR_OVERVIEW_LOAD:
      return {
        ...state,
        selectedTranslator: {
          ...(action.translator as ClerkTranslator),
        },
        status: APIResponseStatus.NotStarted,
      };
    case CLERK_TRANSLATOR_OVERVIEW_LOADING:
      return {
        ...state,
        overviewStatus: APIResponseStatus.InProgress,
      };
    case CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS:
      return {
        ...state,
        translatorDetailsStatus: APIResponseStatus.InProgress,
      };
    case CLERK_TRANSLATOR_OVERVIEW_RESET_UPDATE:
      return {
        ...state,
        translatorDetailsStatus: APIResponseStatus.NotStarted,
      };
    case CLERK_TRANSLATOR_OVERVIEW_FETCH_SUCCESS:
      return {
        ...state,
        selectedTranslator: {
          ...(action.translator as ClerkTranslator),
        },
        overviewStatus: APIResponseStatus.Success,
      };
    case CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS: {
      return {
        ...state,
        selectedTranslator: {
          ...(action.translator as ClerkTranslator),
        },
        overviewStatus: APIResponseStatus.Success,
        translatorDetailsStatus: APIResponseStatus.Success,
      };
    }
    case CLERK_TRANSLATOR_OVERVIEW_FETCH_FAIL:
      return {
        ...state,
        overviewStatus: APIResponseStatus.Error,
      };
    case CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL: {
      return {
        ...state,
        translatorDetailsStatus: APIResponseStatus.Error,
      };
    }
    default:
      return state;
  }
};
