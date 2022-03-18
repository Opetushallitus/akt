import { Dayjs } from 'dayjs';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity } from 'enums/app';
import {
  AddAuthorisationAction,
  Authorisation,
} from 'interfaces/authorisation';
import {
  CLERK_TRANSLATOR_ADD_AUTHORISATION,
  CLERK_TRANSLATOR_ADD_AUTHORISATION_ERROR,
  CLERK_TRANSLATOR_ADD_AUTHORISATION_SUCCESS,
} from 'redux/actionTypes/authorisation';
import { CLERK_TRANSLATOR_OVERVIEW_FETCH } from 'redux/actionTypes/clerkTranslatorOverview';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';

function* showErrorToastOnAdd() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Error,
    t(
      'akt.component.clerkTranslatorOverview.translatorDetails.addAuthorisation.toasts.error'
    )
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

function* showSuccessToastOnAdd() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Success,
    t(
      'akt.component.clerkTranslatorOverview.translatorDetails.addAuthorisation.toasts.success'
    )
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

const formatDate = (date?: Dayjs) => date && date.format('YYYY-MM-DD');

const createAuthorisationBody = ({
  basis,
  diaryNumber,
  termBeginDate,
  termEndDate,
  permissionToPublish,
  languagePair: { from, to },
}: Authorisation) => {
  return {
    basis,
    from,
    to,
    termBeginDate: formatDate(termBeginDate),
    termEndDate: formatDate(termEndDate),
    permissionToPublish,
    diaryNumber,
    // meetingDate: formatDate(autDate),
    // autDate: formatDate(autDate),
  };
};

export function* addAuthorisation(action: AddAuthorisationAction) {
  try {
    const authorisation = createAuthorisationBody(action.authorisation);
    const { translatorId } = action.authorisation;
    yield call(
      axiosInstance.post,
      `${APIEndpoints.ClerkTranslator}/${translatorId}/authorisation`,
      JSON.stringify(authorisation)
    );
    yield put({ type: CLERK_TRANSLATOR_ADD_AUTHORISATION_SUCCESS });
    yield call(showSuccessToastOnAdd);
    yield put({ type: CLERK_TRANSLATOR_OVERVIEW_FETCH, id: translatorId });
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_ADD_AUTHORISATION_ERROR });
    yield call(showErrorToastOnAdd);
  }
}

export function* watchAddAuthorisation() {
  yield takeLatest(CLERK_TRANSLATOR_ADD_AUTHORISATION, addAuthorisation);
}
