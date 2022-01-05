import { Reducer } from 'redux';

import {
  ContactRequestAction,
  ContactRequestState,
} from 'interfaces/contactRequest';
import {
  CONTACT_REQUEST_ERROR,
  CONTACT_REQUEST_RESET,
  CONTACT_REQUEST_SEND,
  CONTACT_REQUEST_SET,
  CONTACT_REQUEST_SUCCESS,
  CONTACT_REQUEST_STEP_DECREASE,
  CONTACT_REQUEST_STEP_INCREASE,
} from 'redux/actionTypes/contactRequest';
import { APIResponseStatus } from 'enums/api';
import { ContactRequestFormStep } from 'enums/contactRequest';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  activeStep: ContactRequestFormStep.VerifyTranslators,
  request: {
    languagePair: { from: '', to: '' },
    translatorIds: [],
    email: '',
    firstName: '',
    lastName: '',
    message: '',
    phoneNumber: '',
  },
};

export const contactRequestReducer: Reducer<
  ContactRequestState,
  ContactRequestAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case CONTACT_REQUEST_SET:
      return {
        ...state,
        request: { ...state.request, ...action.request },
      };
    case CONTACT_REQUEST_SEND:
      return { ...state, status: APIResponseStatus.InProgress };
    case CONTACT_REQUEST_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    case CONTACT_REQUEST_SUCCESS:
      return { ...state, status: APIResponseStatus.Success };
    case CONTACT_REQUEST_STEP_DECREASE:
      return { ...state, activeStep: --state.activeStep };
    case CONTACT_REQUEST_STEP_INCREASE:
      return { ...state, activeStep: ++state.activeStep };
    case CONTACT_REQUEST_RESET:
      return defaultState;
    default:
      return state;
  }
};
