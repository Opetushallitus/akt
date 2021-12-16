import { call, put, takeLatest } from 'redux-saga/effects';
import { Action } from 'redux';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  CONTACT_REQUEST_ERROR,
  CONTACT_REQUEST_SEND,
  CONTACT_REQUEST_SUCCESS,
  isContactRequestSendAction,
} from 'redux/actionTypes/contactRequest';

export function* sendContactRequest(action: Action) {
  if (isContactRequestSendAction(action)) {
    const request = action.request;
    try {
      yield call(
        axiosInstance.post,
        APIEndpoints.ContactRequest,
        JSON.stringify(request)
      );
      yield put({ type: CONTACT_REQUEST_SUCCESS });
    } catch (error) {
      yield put({ type: CONTACT_REQUEST_ERROR, error });
    }
  }
}

export function* watchContactRequest() {
  yield takeLatest(CONTACT_REQUEST_SEND, sendContactRequest);
}
