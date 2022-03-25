import { Dayjs } from 'dayjs';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity } from 'enums/app';
import { AuthorisationBasisEnum } from 'enums/clerkTranslator';
import {
  AddAuthorisationAction,
  Authorisation,
} from 'interfaces/authorisation';
import {
  CLERK_TRANSLATOR_AUTHORISATION_ADD,
  CLERK_TRANSLATOR_AUTHORISATION_ADD_ERROR,
  CLERK_TRANSLATOR_AUTHORISATION_ADD_SUCCESS,
} from 'redux/actionTypes/authorisation';
import { CLERK_TRANSLATOR_OVERVIEW_FETCH } from 'redux/actionTypes/clerkTranslatorOverview';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';
import { DateUtils } from 'utils/date';

function* showErrorToastOnAdd() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Error,
    t('akt.component.newAuthorisation.toasts.error')
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

function* showSuccessToastOnAdd() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Success,
    t('akt.component.newAuthorisation.toasts.success')
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

const formatDate = (date?: Dayjs) =>
  date && DateUtils.convertToAPIRequestDateString(date);

const createAuthorisationBody = ({
  basis,
  diaryNumber,
  termBeginDate,
  termEndDate,
  autDate,
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
    ...(basis === AuthorisationBasisEnum.AUT && {
      autDate: formatDate(autDate),
    }),
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
    yield put({ type: CLERK_TRANSLATOR_AUTHORISATION_ADD_SUCCESS });
    yield call(showSuccessToastOnAdd);
    yield put({ type: CLERK_TRANSLATOR_OVERVIEW_FETCH, id: translatorId });
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_AUTHORISATION_ADD_ERROR });
    yield call(showErrorToastOnAdd);
  }
}

export function* watchAddAuthorisation() {
  yield takeLatest(CLERK_TRANSLATOR_AUTHORISATION_ADD, addAuthorisation);
}
