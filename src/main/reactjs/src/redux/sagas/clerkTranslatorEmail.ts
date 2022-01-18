import { call, put, select } from '@redux-saga/core/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity } from 'enums/app';
import {
  CLERK_TRANSLATOR_EMAIL_ERROR,
  CLERK_TRANSLATOR_EMAIL_REDIRECT_TO_HOMEPAGE,
  CLERK_TRANSLATOR_EMAIL_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorEmail';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { selectClerkTranslatorEmail } from 'redux/selectors/clerkTranslatorEmail';
import { Utils } from 'utils/index';

export function* redirectAndReset() {
  // Actual navigation and final state reset is done in the component.
  yield put({
    type: CLERK_TRANSLATOR_EMAIL_REDIRECT_TO_HOMEPAGE,
  });
}

function* showSuccessToast() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Success,
    t('akt.pages.clerkSendEmailPage.toasts.success')
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
  yield call(redirectAndReset);
}

function* showErrorToast() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Error,
    t('akt.pages.clerkSendEmailPage.toasts.error')
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

export function* sendEmail() {
  const { email, recipients }: ReturnType<typeof selectClerkTranslatorEmail> =
    yield select(selectClerkTranslatorEmail);
  try {
    yield call(
      axiosInstance.post,
      APIEndpoints.InformalClerkTranslatorEmail,
      JSON.stringify({
        subject: email.subject,
        body: email.body,
        translatorIds: recipients,
      })
    );
    yield put({ type: CLERK_TRANSLATOR_EMAIL_SUCCESS });
    yield call(showSuccessToast);
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_EMAIL_ERROR });
    yield call(showErrorToast);
  }
}
