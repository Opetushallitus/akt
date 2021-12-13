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

export function* storeApiResults(
  apiResults: AxiosResponse<PublicTranslatorResponse>
) {
  const { translators, langs, towns } = apiResults.data;
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
    const apiResults: AxiosResponse<PublicTranslatorResponse> = yield call(
      axiosInstance.get,
      APIEndpoints.PublicTranslatorDetails
    );
    yield call(storeApiResults, apiResults);
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
