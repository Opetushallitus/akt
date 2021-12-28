import { all } from 'redux-saga/effects';

import { watchFetchPublicTranslators } from 'redux/sagas/publicTranslator';
import { watchContactRequest } from 'redux/sagas/contactRequest';

export default function* rootSaga() {
  yield all([watchFetchPublicTranslators(), watchContactRequest()]);
}
