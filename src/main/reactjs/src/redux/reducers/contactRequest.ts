import { Reducer } from 'redux';

import {
  //ContactRequest,
  ContactRequestAction,
  ContactRequestState,
} from 'interfaces/contactRequest';
import {
  CONTACT_REQUEST_ERROR,
  CONTACT_REQUEST_RESET,
  CONTACT_REQUEST_SEND,
  CONTACT_REQUEST_SET,
  CONTACT_REQUEST_SUCCESS,
} from 'redux/actionTypes/contactRequest';
import { APIResponseStatus } from 'enums/api';

const defaultState = { status: APIResponseStatus.NotStarted };

export const contactRequestReducer: Reducer<
  ContactRequestState,
  ContactRequestAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case CONTACT_REQUEST_SET:
      return { status: APIResponseStatus.NotStarted, request: action.request };
    case CONTACT_REQUEST_SEND:
      return { ...state, status: APIResponseStatus.InProgress };
    case CONTACT_REQUEST_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    case CONTACT_REQUEST_SUCCESS:
      return { ...state, status: APIResponseStatus.Success };
    case CONTACT_REQUEST_RESET:
      return defaultState;
    default:
      return state;
  }
};
