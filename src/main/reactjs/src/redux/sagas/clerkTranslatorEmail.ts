import { call, put, select } from '@redux-saga/core/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity, UIStates, Variant } from 'enums/app';
import { resetClerkTranslatorEmail } from 'redux/actions/clerkTranslatorEmail';
import { displayUIState } from 'redux/actions/navigation';
import {
  CLERK_TRANSLATOR_EMAIL_ERROR,
  CLERK_TRANSLATOR_EMAIL_SUCCESS,
} from 'redux/actionTypes/clerkTranslatorEmail';
import {
  NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET,
  NOTIFIER_ACTION_DO_NOTHING,
  NOTIFIER_DIALOG_ADD,
} from 'redux/actionTypes/notifier';
import { selectClerkTranslatorEmail } from 'redux/selectors/clerkTranslatorEmail';
import { Utils } from 'utils/index';

export function* resetEmail() {
  yield put(resetClerkTranslatorEmail);
  yield put(displayUIState(UIStates.ClerkTranslatorRegistry));
}

function* showSuccessDialog() {
  const t = translateOutsideComponent();
  const tPrefix = 'akt.pages.clerkSendEmailPage.dialogs.success.';
  const notifier = Utils.createNotifierDialog(
    t(tPrefix + 'title'),
    Severity.Success,
    t(tPrefix + 'description'),
    [
      {
        title: t(tPrefix + 'back'),
        variant: Variant.Contained,
        action: NOTIFIER_ACTION_CLERK_TRANSLATOR_EMAIL_RESET,
      },
    ]
  );
  yield put({ type: NOTIFIER_DIALOG_ADD, notifier });
}

function* showErrorDialog() {
  const t = translateOutsideComponent();
  const tPrefix = 'akt.pages.clerkSendEmailPage.dialogs.error.';
  const notifier = Utils.createNotifierDialog(
    t(tPrefix + 'title'),
    Severity.Error,
    t(tPrefix + 'description'),
    [
      {
        title: t(tPrefix + 'back'),
        variant: Variant.Contained,
        action: NOTIFIER_ACTION_DO_NOTHING,
      },
    ]
  );
  yield put({ type: NOTIFIER_DIALOG_ADD, notifier });
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
    yield call(showSuccessDialog);
  } catch (error) {
    yield put({ type: CLERK_TRANSLATOR_EMAIL_ERROR });
    yield call(showErrorDialog);
  }
}
