import { put, takeLatest } from 'redux-saga/effects';

import {
  NOTIFIER_ACTION_CONTACT_REQUEST_RESET,
  NOTIFIER_ACTION_CONTACT_REQUEST_EMPTY,
} from 'redux/actionTypes/notifier';
import { UIStates } from 'enums/app';
import {
  CONTACT_REQUEST_RESET,
  CONTACT_REQUEST_RESET_REDIRECT,
} from 'redux/actionTypes/contactRequest';
import { PUBLIC_TRANSLATOR_EMPTY_SELECTIONS } from 'redux/actionTypes/publicTranslator';
import { displayUIState } from 'redux/actions/navigation';

export function* resetContactRequest() {
  yield put({ type: CONTACT_REQUEST_RESET });
  yield put({ type: PUBLIC_TRANSLATOR_EMPTY_SELECTIONS });
  yield put(displayUIState(UIStates.PublicTranslatorListing));
}

export function* emptyContactRequestState() {
  yield put({ type: CONTACT_REQUEST_RESET });
}

export function* watchContactRequestNotifier() {
  yield takeLatest(
    [NOTIFIER_ACTION_CONTACT_REQUEST_RESET, CONTACT_REQUEST_RESET_REDIRECT],
    resetContactRequest
  );
  yield takeLatest(
    NOTIFIER_ACTION_CONTACT_REQUEST_EMPTY,
    emptyContactRequestState
  );
}
