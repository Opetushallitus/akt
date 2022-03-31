import { AxiosError, AxiosResponse } from 'axios';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  ClerkTranslator,
  ClerkTranslatorResponse,
} from 'interfaces/clerkTranslator';
import {
  AuthorisationAction,
  ClerkTranslatorOverviewAction,
} from 'interfaces/clerkTranslatorOverview';
import { startLoadingClerkTranslatorOverview } from 'redux/actions/clerkTranslatorOverview';
import {
  CLERK_TRANSLATOR_OVERVIEW_CANCEL_UPDATE,
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION,
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_FETCH,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_FETCH_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_AUTHORISATION_PUBLISH_PERMISSION,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_AUTHORISATION_PUBLISH_PERMISSION_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_AUTHORISATION_PUBLISH_PERMISSION_SUCCESS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL,
  CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorOverview';
import { CLERK_TRANSLATOR_RECEIVED } from 'redux/actionTypes/clerkTranslators';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { clerkTranslatorsSelector } from 'redux/selectors/clerkTranslator';
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

export function* updateClerkTranslatorsState(translator: ClerkTranslator) {
  const { translators, langs, meetingDates } = yield select(
    clerkTranslatorsSelector
  );
  const translatorIdx = translators.findIndex(
    (t: ClerkTranslator) => t.id === translator.id
  );
  translators.splice(translatorIdx, 1, translator);

  yield put({
    type: CLERK_TRANSLATOR_RECEIVED,
    translators,
    langs,
    meetingDates,
  });
}

function* updateClerkTranslatorDetails(action: ClerkTranslatorOverviewAction) {
  try {
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.put,
      APIEndpoints.ClerkTranslator,
      APIUtils.convertClerkTranslatorToAPIRequest(
        action.translator as ClerkTranslator
      )
    );
    const translator = APIUtils.convertClerkTranslatorResponse(
      apiResponse.data
    );
    yield updateClerkTranslatorsState(translator);

    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_SUCCESS,
      translator,
    });
  } catch (error) {
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_TRANSLATOR_DETAILS_FAIL,
    });
    yield put({
      type: NOTIFIER_TOAST_ADD,
      notifier: Utils.createNotifierToastForAxiosError(error as AxiosError),
    });
  }
}

function* updateAuthorisationPublishPermission(action: AuthorisationAction) {
  const requestBody = {
    id: action.id,
    version: action.version,
    permissionToPublish: action.permissionToPublish,
  };

  try {
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.put,
      APIEndpoints.AuthorisationPublishPermission,
      requestBody
    );
    const translator = APIUtils.convertClerkTranslatorResponse(
      apiResponse.data
    );
    yield updateClerkTranslatorsState(translator);

    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_AUTHORISATION_PUBLISH_PERMISSION_SUCCESS,
      translator,
    });
  } catch (error) {
    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_UPDATE_AUTHORISATION_PUBLISH_PERMISSION_FAIL,
    });
    yield put({
      type: NOTIFIER_TOAST_ADD,
      notifier: Utils.createNotifierToastForAxiosError(error as AxiosError),
    });
  }
}

function* deleteAuthorisation(action: AuthorisationAction) {
  try {
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.delete,
      `${APIEndpoints.Authorisation}/${action.id}`
    );
    const translator = APIUtils.convertClerkTranslatorResponse(
      apiResponse.data
    );
    yield updateClerkTranslatorsState(translator);

    yield put({
      type: CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_SUCCESS,
      translator,
    });
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION_FAIL });
    yield put({
      type: NOTIFIER_TOAST_ADD,
      notifier: Utils.createNotifierToastForAxiosError(error as AxiosError),
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
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_UPDATE_AUTHORISATION_PUBLISH_PERMISSION,
    updateAuthorisationPublishPermission
  );
  yield takeLatest(
    CLERK_TRANSLATOR_OVERVIEW_DELETE_AUTHORISATION,
    deleteAuthorisation
  );
}
