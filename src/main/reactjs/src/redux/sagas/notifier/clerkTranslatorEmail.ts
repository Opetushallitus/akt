import { takeLatest } from 'redux-saga/effects';

import {
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET,
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_SEND,
} from 'redux/actionTypes/notifier';
import { resetEmail, sendEmail } from 'redux/sagas/clerkTranslatorEmail';

export function* watchClerkTranslatorEmailNotifier() {
  yield takeLatest(NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET, resetEmail);
  yield takeLatest(NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_SEND, sendEmail);
}
