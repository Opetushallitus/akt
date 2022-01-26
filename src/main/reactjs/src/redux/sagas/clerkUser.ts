import { takeLatest, call, put } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { ExternalAPIEndpoints } from 'enums/external';
import { HTTPStatusCode } from 'enums/app';
import { ClerkUserAPIResponse } from 'interfaces/clerkUser';
import { setClerkUser } from 'redux/actions/clerkUser';
import {
  CLERK_USER_ERROR,
  CLERK_USER_LOAD,
  CLERK_USER_MOCK_LOAD,
} from 'redux/actionTypes/clerkUser';
import { APIResponseStatus } from 'enums/api';

export function* fetchClerkUser() {
  try {
    const response: AxiosResponse<ClerkUserAPIResponse> = yield call(
      axiosInstance.get,
      ExternalAPIEndpoints.ClerkUser
    );

    if (response.status === HTTPStatusCode.Ok) {
      yield put(setClerkUser(response.data));
    }
  } catch (error) {
    yield put({ type: CLERK_USER_ERROR });
  }
}

export function* setClerkMockUser() {
  const mockClerkUser = {
    status: APIResponseStatus.Success,
    isAuthenticated: true,
    uid: 'testuser',
    oid: '1.2.246.562.24.11111111111',
    firstName: 'Test',
    lastName: 'User',
  };

  yield put(setClerkUser(mockClerkUser));
}

export function* watchFetchClerkUser() {
  yield takeLatest(CLERK_USER_LOAD, fetchClerkUser);
  yield takeLatest(CLERK_USER_MOCK_LOAD, setClerkMockUser);
}
