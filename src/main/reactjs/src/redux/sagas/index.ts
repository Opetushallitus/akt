import { all } from 'redux-saga/effects';

import { watchFetchPublicTranslators } from 'redux/sagas/publicTranslator';
import { watchContactRequest } from 'redux/sagas/contactRequest';
import { watchContactRequestNotifier } from 'redux/sagas/notifier/contactRequest';

export default function* rootSaga() {
  yield all([
    watchFetchPublicTranslators(),
    watchContactRequest(),
    watchContactRequestNotifier(),
  ]);
}
