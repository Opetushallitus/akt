import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  ClerkTranslatorAPIResponse,
  ClerkTranslatorResponse,
} from 'interfaces/clerkTranslator';
import {
  CLERK_TRANSLATOR_ERROR,
  CLERK_TRANSLATOR_LOAD,
  CLERK_TRANSLATOR_LOADING,
  CLERK_TRANSLATOR_RECEIVED,
} from 'redux/actionTypes/clerkTranslators';
import { APIUtils } from 'utils/api';

export const convertAPIResponse = (
  response: ClerkTranslatorAPIResponse
): ClerkTranslatorResponse => {
  const APITranslators = response.translators;
  const APIMeetingDates = response.meetingDates;
  const { langs } = response;
  const translators = APITranslators.map(APIUtils.convertAPIClerkTranslator);
  const meetingDates = APIMeetingDates.map(APIUtils.convertAPIMeetingDate);

  return { translators, langs, meetingDates };
};

export function* fetchClerkTranslators() {
  try {
    yield put({ type: CLERK_TRANSLATOR_LOADING });
    const apiResponse: AxiosResponse<ClerkTranslatorAPIResponse> = yield call(
      axiosInstance.get,
      APIEndpoints.ClerkTranslator
    );
    const convertedResponse = convertAPIResponse(apiResponse.data);
    yield call(storeApiResults, convertedResponse);
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_ERROR, error });
  }
}

export function* storeApiResults(response: ClerkTranslatorResponse) {
  const { translators, langs, meetingDates } = response;
  yield put({
    type: CLERK_TRANSLATOR_RECEIVED,
    translators,
    langs,
    meetingDates,
  });
}

export function* watchFetchClerkTranslators() {
  yield takeLatest(CLERK_TRANSLATOR_LOAD, fetchClerkTranslators);
}
