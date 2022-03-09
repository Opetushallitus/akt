import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { ClerkTranslatorResponse } from 'interfaces/clerkTranslator';
import { ClerkTranslatorOverviewAction } from 'interfaces/clerkTranslatorOverview';
import { startLoadingClerkTranslatorOverview } from 'redux/actions/clerkTranslatorOverview';
import {
  CLERK_TRANSLATOR_OVERVIEW_CANCEL_UPDATE,
  CLERK_TRANSLATOR_OVERVIEW_FETCH,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorOverview';
import { APIUtils } from 'utils/api';

export function* cancel() {
  yield put({ type: CLERK_TRANSLATOR_OVERVIEW_CANCEL_UPDATE });
}

function* fetchClerkTranslatorOverview(action: ClerkTranslatorOverviewAction) {
  try {
    yield put(startLoadingClerkTranslatorOverview);
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.get,
      `${APIEndpoints.ClerkTranslator}/${action.id}`
    );

    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_FETCH_SUCCESS,
      translator: APIUtils.convertClerkTranslatorResponse(apiResponse.data),
    });
  } catch (error) {
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_FETCH_FAIL,
    });
  }
}

function* updateClerkTranslatorDetails(action: ClerkTranslatorOverviewAction) {
  try {
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.put,
      APIEndpoints.ClerkTranslator,
      JSON.stringify(action.translator)
    );
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
      translator: APIUtils.convertClerkTranslatorResponse(apiResponse.data),
    });
  } catch (error) {
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL,
    });
  }
}

export function* watchClerkTranslatorOverview() {
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
    updateClerkTranslatorDetails
  );
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_FETCH,
    fetchClerkTranslatorOverview
  );
}
