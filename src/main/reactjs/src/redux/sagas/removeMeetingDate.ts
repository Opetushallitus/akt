import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity } from 'enums/app';
import { MEETING_DATE_LOAD } from 'redux/actionTypes/meetingDate';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import {
  MEETING_DATE_REMOVE,
  MEETING_DATE_REMOVE_ERROR,
  MEETING_DATE_REMOVE_SUCCESS,
  RemoveMeetingDateActionType,
} from 'redux/actionTypes/removeMeetingDate';
import { Utils } from 'utils';

function* showErrorToast() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Error,
    t('akt.component.addMeetingDate.toast.error')
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

export function* removeMeetingDate(action: RemoveMeetingDateActionType) {
  try {
    yield call(
      axiosInstance.delete,
      `${APIEndpoints.meetingDates}/${action.meetingDateId}`
    );
    yield put({ type: MEETING_DATE_REMOVE_SUCCESS });
    yield put({ type: MEETING_DATE_LOAD });
  } catch (error) {
    yield put({ type: MEETING_DATE_REMOVE_ERROR });
    yield call(showErrorToast);
  }
}

export function* watchRemoveMeetingDate() {
  yield takeLatest(MEETING_DATE_REMOVE, removeMeetingDate);
}
