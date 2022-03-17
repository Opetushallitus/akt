import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';

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
  }
}

export function* watchClerkNewTranslatorSave() {
  yield takeLatest(CLERK_NEW_TRANSLATOR_SAVE, saveNewClerkTranslator);
}