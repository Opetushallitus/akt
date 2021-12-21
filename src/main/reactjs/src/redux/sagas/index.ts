import { all } from 'redux-saga/effects';

import { watchFetchTranslatorDetails } from 'redux/sagas/translatorDetails';
import { watchContactRequest } from './contactRequest';

export default function* rootSaga() {
  yield all([watchFetchTranslatorDetails(), watchContactRequest()]);
}
