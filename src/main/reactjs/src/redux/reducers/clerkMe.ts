import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  CLERK_ME_ERROR,
  CLERK_ME_LOAD,
  CLERK_ME_MOCK_RECEIVED,
  CLERK_ME_RECEIVED,
} from 'redux/actionTypes/clerkMe';
import { ClerkMeAction, ClerkMeState } from 'interfaces/clerkMe';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  isAuthenticated: false,
  uid: '',
  oid: '',
  firstName: '',
  lastName: '',
};

const mockDefaultState = {
  status: APIResponseStatus.Success,
  isAuthenticated: true,
  uid: 'testuser',
  oid: '1.2.246.562.24.11111111111',
  firstName: 'Test',
  lastName: 'User',
};

export const clerkMeReducer: Reducer<ClerkMeState, ClerkMeAction> = (
  state = defaultState,
  action
) => {
  switch (action.type) {
    case CLERK_ME_LOAD:
      return {
        ...state,
        status: APIResponseStatus.InProgress,
      };
    case CLERK_ME_RECEIVED:
      const { uid, oid, firstName, lastName } = action?.clerkInfo;

      return {
        ...state,
        status: APIResponseStatus.Success,
        isAuthenticated: true,
        uid,
        oid,
        firstName,
        lastName,
      };
    case CLERK_ME_ERROR:
      return {
        ...state,
        status: APIResponseStatus.Error,
        isAuthenticated: false,
      };
    case CLERK_ME_MOCK_RECEIVED:
      return mockDefaultState;
    default:
      return defaultState;
  }
};
