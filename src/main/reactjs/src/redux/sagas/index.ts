import { all } from 'redux-saga/effects';

import { watchFetchClerkTranslators } from 'redux/sagas/clerkTranslator';
import { watchFetchPublicTranslators } from 'redux/sagas/publicTranslator';
import { watchContactRequest } from 'redux/sagas/contactRequest';
import { watchContactRequestNotifier } from 'redux/sagas/notifier/contactRequest';
import { watchClerkTranslatorEmailNotifier } from 'redux/sagas//notifier/clerkTranslatorEmail';

export default function* rootSaga() {
  yield all([
    watchFetchClerkTranslators(),
    watchFetchPublicTranslators(),
    watchContactRequest(),
    watchContactRequestNotifier(),
    watchClerkTranslatorEmailNotifier(),
  ]);
}
