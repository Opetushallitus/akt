import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  AddAuthorisationAction,
  AddAuthorisationState,
} from 'interfaces/authorisation';
import {
  CLERK_TRANSLATOR_ADD_AUTHORISATION,
  CLERK_TRANSLATOR_ADD_AUTHORISATION_ERROR,
  CLERK_TRANSLATOR_ADD_AUTHORISATION_SUCCESS,
} from 'redux/actionTypes/authorisation';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  authorisation: {},
};

export const authorisationReducer: Reducer<
  AddAuthorisationState,
  AddAuthorisationAction
> = (state = defaultState, action) => {
  const authorisation = action.authorisation;

  switch (action.type) {
    case CLERK_TRANSLATOR_ADD_AUTHORISATION:
      return {
        ...state,
        authorisation,
        status: APIResponseStatus.InProgress,
      };
    case CLERK_TRANSLATOR_ADD_AUTHORISATION_SUCCESS:
      return {
        ...state,
        authorisation,
        status: APIResponseStatus.Success,
      };
    case CLERK_TRANSLATOR_ADD_AUTHORISATION_ERROR:
      return {
        ...state,
        authorisation,
        status: APIResponseStatus.Error,
      };
    default:
      return state;
  }
};
