import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { PublicTranslatorResponse } from 'interfaces/translator';
import {
  TRANSLATOR_DETAILS_ERROR,
  TRANSLATOR_DETAILS_LOAD,
  TRANSLATOR_DETAILS_LOADING,
  TRANSLATOR_DETAILS_RECEIVED,
} from 'redux/actionTypes/translatorDetails';

// Helpers
const mapPublicTranslationResponse = (response: PublicTranslatorResponse) => {
  const translators = response.translators
    .map((t) => t.languagePairs.map((l) => ({ ...t, languagePairs: [l] })))
    .reduce((prev, current) => [...prev, ...current]);

  return { ...response, translators };
};

export function* storeApiResults(apiResults: PublicTranslatorResponse) {
  const { translators, langs, towns } = apiResults;
  yield put({
    type: TRANSLATOR_DETAILS_RECEIVED,
    translators,
    langs,
    towns,
  });
}

export function* fetchTranslatorDetails() {
  try {
    yield put({ type: TRANSLATOR_DETAILS_LOADING });
    // TODO Add runtime validation (io-ts) for API response?
    const apiResponse: AxiosResponse<PublicTranslatorResponse> = yield call(
      axiosInstance.get,
      APIEndpoints.PublicTranslatorDetails
    );
    const mappedResponse = mapPublicTranslationResponse(apiResponse.data);

    yield call(storeApiResults, mappedResponse);
  } catch (error) {
    yield put({ type: TRANSLATOR_DETAILS_ERROR, error });
  }
}

export function* callFetchTranslatorDetails() {
  yield call(fetchTranslatorDetails);
}

export function* watchFetchTranslatorDetails() {
  yield takeLatest(TRANSLATOR_DETAILS_LOAD, fetchTranslatorDetails);
}
