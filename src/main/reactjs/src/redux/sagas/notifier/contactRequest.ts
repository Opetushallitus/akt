import { put, takeLatest } from 'redux-saga/effects';

import { NOTIFIER_ACTION_CONTACT_REQUEST_RESET } from 'redux/actionTypes/notifier';
import { UIStates } from 'enums/app';
import { DISPLAY_UI_STATE } from 'redux/actionTypes/navigation';
import { CONTACT_REQUEST_RESET } from 'redux/actionTypes/contactRequest';

export function* resetContactRequest() {
  yield put({ type: CONTACT_REQUEST_RESET });
  yield put({
    type: DISPLAY_UI_STATE,
    state: UIStates.PublicTranslatorListing,
  });
}

export function* watchContactRequestNotifier() {
  yield takeLatest(NOTIFIER_ACTION_CONTACT_REQUEST_RESET, resetContactRequest);
}