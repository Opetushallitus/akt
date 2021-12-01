import { all, call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { ApiEndpoints } from 'enums/apiEndpoints';
import {
  ApiTranslatorDetails,
  PublicTranslatorListApiResponse,
  TranslatorDetails,
} from 'interfaces/translator';

const reshapeApiResponse = (
  details: ApiTranslatorDetails
): TranslatorDetails => {
  const languagePairs = details.languagePairs.map(({ fromLang, toLang }) => {
    return { from: fromLang, to: toLang };
  });
  const name = details.firstName + ' ' + details.lastName;
  return {
    id: details.id,
    town: details.town,
    country: details.country,
    name,
    languagePairs,
  };
};

export function* storeApiResults(
  apiResults: AxiosResponse<PublicTranslatorListApiResponse>
) {
  const translatorDetails = apiResults.data.content;
  const reshapedTranslatorDetails = translatorDetails.map(reshapeApiResponse);
  yield put({
    type: 'TRANSLATOR_DETAILS/RECEIVED',
    translatorDetails: reshapedTranslatorDetails,
  });
}

export function* getTranslatorsFromApi() {
  try {
    yield put({ type: 'TRANSLATOR_DETAILS/LOADING' });
    // TODO Add runtime validation (io-ts) for API response?
    const apiResults: AxiosResponse<PublicTranslatorListApiResponse> =
      yield call(axiosInstance.get, ApiEndpoints.PublicTranslatorDetails);
    yield call(storeApiResults, apiResults);
  } catch (error) {
    yield put({ type: 'TRANSLATOR_DETAILS/ERROR', error });
  }
}

export function* forceGetTranslatorsFromApi() {
  yield call(getTranslatorsFromApi);
}

export function* watchTranslatorDetails() {
  yield takeLatest('TRANSLATOR_DETAILS/LOAD', getTranslatorsFromApi);
}

export default function* rootSaga() {
  yield all([watchTranslatorDetails()]);
}
