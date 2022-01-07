import { call, put, takeLatest } from 'redux-saga/effects';
import { Action } from 'redux';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  CONTACT_REQUEST_ERROR,
  CONTACT_REQUEST_SEND,
  CONTACT_REQUEST_SUCCESS,
  CONTACT_REQUEST_STEP_INCREASE,
  isContactRequestSendAction,
} from 'redux/actionTypes/contactRequest';

export function* sendContactRequest(action: Action) {
  if (isContactRequestSendAction(action)) {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      languagePair,
      translatorIds,
      message,
    } = action.request;
    try {
      yield call(
        axiosInstance.post,
        APIEndpoints.ContactRequest,
        JSON.stringify({
          firstName,
          lastName,
          email,
          phoneNumber,
          translatorIds,
          message,
          fromLang: languagePair.from,
          toLang: languagePair.to,
        })
      );
      yield put({ type: CONTACT_REQUEST_SUCCESS });
      yield put({ type: CONTACT_REQUEST_STEP_INCREASE });
    } catch (error) {
      yield put({ type: CONTACT_REQUEST_ERROR, error });
    }
  }
}

export function* watchContactRequest() {
  yield takeLatest(CONTACT_REQUEST_SEND, sendContactRequest);
}
