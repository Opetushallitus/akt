import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import { fetch } from 'api';
import {
  ApiTranslatorDetails,
  PublicTranslatorListApiResponse,
  TranslatorDetails,
} from 'interfaces/translator';

function* getTranslatorDetails() {
  try {
    yield put({ type: 'TRANSLATOR_DETAILS/LOADING' });
    // TODO Add runtime validation (io-ts) for API response?
    const apiResponse: AxiosResponse<PublicTranslatorListApiResponse> =
      yield call(fetch, 'translator');
    const translatorDetails = apiResponse.data.content;
    const reshapeApiResponse = (
      details: ApiTranslatorDetails
    ): TranslatorDetails => {
      const languagePairs = details.languagePairs.map(
        ({ fromLang, toLang }) => {
          return { from: fromLang, to: toLang };
        }
      );
      const name = details.firstName + ' ' + details.lastName;
      return { ...details, name, languagePairs };
    };
    const reshapedTranslatorDetails = translatorDetails.map(reshapeApiResponse);
    yield put({
      type: 'TRANSLATOR_DETAILS/RECEIVED',
      translatorDetails: reshapedTranslatorDetails,
    });
  } catch (error) {
    yield put({ type: 'TRANSLATOR_DETAILS/ERROR', error });
  }
}

function* watchTranslatorDetails() {
  yield takeLatest('TRANSLATOR_DETAILS/INITIALISE', getTranslatorDetails);
}

export default function* rootSaga() {
  yield all([watchTranslatorDetails()]);
}
