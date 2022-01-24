import { takeLatest, call, put } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { HTTPStatusCode } from 'enums/app';
import { ClerkMeAPIResponse } from 'interfaces/clerkMe';
import { setClerkMe, setMockClerkMe } from 'redux/actions/clerkMe';
import { CLERK_ME_LOAD, CLERK_ME_MOCK_LOAD } from 'redux/actionTypes/clerkMe';

const CURRENT_URL = window.location.href;

export function* fetchClerkMe() {
  const clerkUrl = 'https://virkailija.';
  try {
    const response: AxiosResponse<ClerkMeAPIResponse> = yield call(
      axiosInstance.get,
      APIEndpoints.ClerkMe
    );

    if (
      CURRENT_URL.includes(clerkUrl) &&
      response.status === HTTPStatusCode.Ok
    ) {
      yield put(setClerkMe(response.data));
    }
  } catch (error) {}
}

export function* setClerkMeMockData() {
  const clerkUrl = '/akt/virkailija';
  if (CURRENT_URL.includes(clerkUrl)) {
    yield put(setMockClerkMe);
  }
}

export function* watchFetchClerkMe() {
  yield takeLatest(CLERK_ME_LOAD, fetchClerkMe);
  yield takeLatest(CLERK_ME_MOCK_LOAD, setClerkMeMockData);
}
