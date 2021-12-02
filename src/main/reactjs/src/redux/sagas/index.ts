import { all } from 'redux-saga/effects';

import { watchFetchTranslatorDetails } from 'redux/sagas/translatorDetails';

export default function* rootSaga() {
  yield all([watchFetchTranslatorDetails()]);
}
