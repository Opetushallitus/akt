import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { ClerkState, ClerkStateResponse } from 'interfaces/clerkState';
import {
  CLERK_TRANSLATOR_ERROR,
  CLERK_TRANSLATOR_LOAD,
  CLERK_TRANSLATOR_LOADING,
  CLERK_TRANSLATOR_RECEIVED,
} from 'redux/actionTypes/clerkTranslators';
import { APIUtils } from 'utils/api';

export const convertAPIResponse = (
  response: ClerkStateResponse
): ClerkState => {
  const { langs } = response;
  const translators = response.translators.map(
    APIUtils.convertClerkTranslatorResponse
  );
  const meetingDates = response.meetingDates.map(
    APIUtils.convertMeetingDateResponse
  );

  return { translators, langs, meetingDates };
};

export function* fetchClerkTranslators() {
  try {
    yield put({ type: CLERK_TRANSLATOR_LOADING });
    const apiResponse: AxiosResponse<ClerkStateResponse> = yield call(
      axiosInstance.get,
      APIEndpoints.ClerkTranslator
    );
    const convertedResponse = convertAPIResponse(apiResponse.data);
    yield call(storeApiResults, convertedResponse);
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_ERROR, error });
  }
}

export function* storeApiResults(response: ClerkState) {
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
