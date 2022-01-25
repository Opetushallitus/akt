import { takeLatest, call, put } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { ExternalAPIEndpoints } from 'enums/external';
import { HTTPStatusCode } from 'enums/app';
import { ClerkMeAPIResponse } from 'interfaces/clerkMe';
import { setClerkMe } from 'redux/actions/clerkMe';
import {
  CLERK_ME_ERROR,
  CLERK_ME_LOAD,
  CLERK_ME_MOCK_LOAD,
} from 'redux/actionTypes/clerkMe';
import { APIResponseStatus } from 'enums/api';

export function* fetchClerkMe() {
  try {
    const response: AxiosResponse<ClerkMeAPIResponse> = yield call(
      axiosInstance.get,
      ExternalAPIEndpoints.ClerkMe
    );

    if (response.status === HTTPStatusCode.Ok) {
      yield put(setClerkMe(response.data));
    }
  } catch (error) {
    yield put({ type: CLERK_ME_ERROR });
  }
}

export function* setClerkMeMockData() {
  const mockClerkMe = {
    status: APIResponseStatus.Success,
    isAuthenticated: true,
    uid: 'testuser',
    oid: '1.2.246.562.24.11111111111',
    firstName: 'Test',
    lastName: 'User',
  };

  yield put(setClerkMe(mockClerkMe));
}

export function* watchFetchClerkMe() {
  yield takeLatest(CLERK_ME_LOAD, fetchClerkMe);
  yield takeLatest(CLERK_ME_MOCK_LOAD, setClerkMeMockData);
}
