import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  CLERK_USER_ERROR,
  CLERK_USER_LOAD,
  CLERK_USER_RECEIVED,
} from 'redux/actionTypes/clerkUser';
import { ClerkUserAction, ClerkUserState } from 'interfaces/clerkUser';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  isAuthenticated: false,
  uid: '',
  oid: '',
  firstName: '',
  lastName: '',
};

export const clerkUserReducer: Reducer<ClerkUserState, ClerkUserAction> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case CLERK_USER_LOAD:
      return {
        ...state,
        status: APIResponseStatus.InProgress,
      };
    case CLERK_USER_RECEIVED:
      const { uid, oid, firstName, lastName } = action?.clerkUser;

      return {
        ...state,
        status: APIResponseStatus.Success,
        isAuthenticated: true,
        uid,
        oid,
        firstName,
        lastName,
      };
    case CLERK_USER_ERROR:
      return {
        ...state,
        status: APIResponseStatus.Error,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};
