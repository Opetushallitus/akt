import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { translateOutsideComponent } from 'configs/i18n';
import { APIEndpoints } from 'enums/api';
import { Severity } from 'enums/app';
import {
  AddMeetingDateActionType,
  MEETING_DATE_ADD,
  MEETING_DATE_ADD_ERROR,
  MEETING_DATE_ADD_SUCCESS,
  MEETING_DATE_REMOVE_CANCEL,
} from 'redux/actionTypes/addMeetingDate';
import { MEETING_DATE_LOAD } from 'redux/actionTypes/meetingDate';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';

export function* cancel() {
  yield put({
    type: MEETING_DATE_REMOVE_CANCEL,
  });
}

function* showErrorToast() {
  const t = translateOutsideComponent();
  const notifier = Utils.createNotifierToast(
    Severity.Error,
    t('akt.component.addMeetingDate.toast.error')
  );
  yield put({ type: NOTIFIER_TOAST_ADD, notifier });
}

export function* addMeetingDate(action: AddMeetingDateActionType) {
  try {
    yield call(
      axiosInstance.post,
      APIEndpoints.meetingDates,
      JSON.stringify({
        date: action.date,
      })
    );
    yield put({ type: MEETING_DATE_ADD_SUCCESS });
    yield put({ type: MEETING_DATE_LOAD });
  } catch (error) {
    yield put({ type: MEETING_DATE_ADD_ERROR });
    yield call(showErrorToast);
  }
}

export function* watchAddMeetingDate() {
  yield takeLatest(MEETING_DATE_ADD, addMeetingDate);
}
