import { AxiosResponse } from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { ClerkTranslator } from 'interfaces/clerkTranslator';
import { ClerkTranslatorOverviewAction } from 'interfaces/clerkTranslatorOverview';
import {
  loadClerkTranslatorOverview,
  startLoadingClerkTranslatorOverview,
} from 'redux/actions/clerkTranslatorOverview';
import {
  CLERK_TRANSLATOR_OVERVIEW_CONTACT_DETAILS_UPDATE_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_LOAD_BY_FETCHING_ALL_TRANSLATORS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorOverview';
import { fetchClerkTranslators } from 'redux/sagas/clerkTranslator';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';

function* loadClerkTranslatorOverviewByFetchingAllTranslators(
  action: ClerkTranslatorOverviewAction
) {
  try {
    // Start loading and fetch translators
    yield put(startLoadingClerkTranslatorOverview);
    yield call(fetchClerkTranslators);
    // Find the translator
    const { translators } = yield select(clerkTranslatorsSelector);
    const selectedTranslator = translators.find(
      (t: ClerkTranslator) => t.id === action.id
    );
    // Save to Redux
    yield put(loadClerkTranslatorOverview(selectedTranslator));
  } catch (error) {
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_CONTACT_DETAILS_UPDATE_FAIL,
    });
  }
}

function* updateClerkTranslatorDetails(action: ClerkTranslatorOverviewAction) {
  try {
    const apiResponse: AxiosResponse<ClerkTranslator> = yield call(
      axiosInstance.put,
      APIEndpoints.ClerkTranslator,
      JSON.stringify(action.updatedTranslator)
    );
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
      updatedTranslator: apiResponse.data,
    });
  } catch (error) {
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_CONTACT_DETAILS_UPDATE_FAIL,
    });
  }
}

export function* watchClerkTranslatorOverview() {
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
    updateClerkTranslatorDetails
  );
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_LOAD_BY_FETCHING_ALL_TRANSLATORS,
    loadClerkTranslatorOverviewByFetchingAllTranslators
  );
}
