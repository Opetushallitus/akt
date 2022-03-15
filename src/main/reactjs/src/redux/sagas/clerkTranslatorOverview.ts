import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity } from 'enums/app';
import { ClerkTranslatorResponse } from 'interfaces/clerkTranslator';
import { ClerkTranslatorOverviewAction } from 'interfaces/clerkTranslatorOverview';
import { startLoadingClerkTranslatorOverview } from 'redux/actions/clerkTranslatorOverview';
import {
  CLERK_TRANSLATOR_OVERVIEW_CANCEL_UPDATE,
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION,
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_FETCH,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorOverview';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';
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

function* deleteAuthorisation(action: ClerkTranslatorOverviewAction) {
  try {
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.delete,
      `${APIEndpoints.Authorisation}/${action.authorisationId}`
    );
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_SUCCESS,
      translator: APIUtils.convertClerkTranslatorResponse(apiResponse.data),
    });
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_FAIL });
    yield call(showErrorToastOnAuthorisationDelete);
  }
}
function* showErrorToastOnAuthorisationDelete() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Error,
    t(
      'akt.component.clerkTranslatorOverview.authorisations.row.removal.toasts.error'
    )
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
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
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION,
    deleteAuthorisation
  );
}
