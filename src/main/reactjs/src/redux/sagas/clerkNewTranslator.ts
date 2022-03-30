import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosError, AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  ClerkNewTranslator,
  ClerkNewTranslatorAction,
} from 'interfaces/clerkNewTranslator';
import { ClerkTranslatorResponse } from 'interfaces/clerkTranslator';
import {
  CLERK_NEW_TRANSLATOR_ERROR,
  CLERK_NEW_TRANSLATOR_SAVE,
  CLERK_NEW_TRANSLATOR_SUCCESS,
} from 'redux/actionTypes/clerkNewTranslator';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';
import { APIUtils } from 'utils/api';

function* saveNewClerkTranslator(action: ClerkNewTranslatorAction) {
  try {
    const translator = action.translator as ClerkNewTranslator;
    const authorisations = translator.authorisations.map(
      APIUtils.convertAuthorisationToAPIRequest
    );
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.post,
      APIEndpoints.ClerkTranslator,
      { ...translator, authorisations }
    );
    const id = apiResponse.data.id;
    yield put({
      type: CLERK_NEW_TRANSLATOR_SUCCESS,
      id,
    });
  } catch (error) {
    yield put({
      type: CLERK_NEW_TRANSLATOR_ERROR,
    });
    yield put({
      type: NOTIFIER_TOAST_ADD,
      notifier: Utils.createNotifierToastForAxiosError(error as AxiosError),
    });
  }
}

export function* watchClerkNewTranslatorSave() {
  yield takeLatest(CLERK_NEW_TRANSLATOR_SAVE, saveNewClerkTranslator);
}
