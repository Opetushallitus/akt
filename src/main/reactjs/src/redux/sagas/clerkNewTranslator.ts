import { call, put, takeLatest } from '@redux-saga/core/effects';
import { AxiosResponse } from 'axios';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { Authorisation } from 'interfaces/authorisation';
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
import { DateUtils } from 'utils/date';

const toAPIRequestAuthorisation = (authorisation: Authorisation) => {
  const { from, to } = authorisation.languagePair;
  const {
    basis,
    termBeginDate,
    termEndDate,
    autDate,
    permissionToPublish,
    diaryNumber,
  } = authorisation;

  return {
    from,
    to,
    basis,
    termBeginDate: DateUtils.convertToAPIRequestDateString(termBeginDate),
    termEndDate: DateUtils.convertToAPIRequestDateString(termEndDate),
    autDate: DateUtils.convertToAPIRequestDateString(autDate),
    permissionToPublish,
    diaryNumber,
  };
};

function* saveNewClerkTranslator(action: ClerkNewTranslatorAction) {
  try {
    const translator = action.translator as ClerkNewTranslator;
    const authorisations = translator.authorisations.map(
      toAPIRequestAuthorisation
    );
    const apiResponse: AxiosResponse<ClerkTranslatorResponse> = yield call(
      axiosInstance.post,
      APIEndpoints.ClerkTranslator,
      JSON.stringify({ ...translator, authorisations })
    );
    const createdTranslatorId = apiResponse.data.id;
    yield put({
      type: CLERK_NEW_TRANSLATOR_SUCCESS,
      createdTranslatorId,
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
