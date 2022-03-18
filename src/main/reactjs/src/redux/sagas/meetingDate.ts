import { AxiosError, AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  AddMeetingDateActionType,
  MeetingDateResponse,
  MeetingDates,
  RemoveMeetingDateActionType,
} from 'interfaces/meetingDate';
import {
  MEETING_DATE_ADD,
  MEETING_DATE_ADD_ERROR,
  MEETING_DATE_ADD_SUCCESS,
  MEETING_DATE_ERROR,
  MEETING_DATE_LOAD,
  MEETING_DATE_LOADING,
  MEETING_DATE_RECEIVED,
  MEETING_DATE_REMOVE,
  MEETING_DATE_REMOVE_ERROR,
  MEETING_DATE_REMOVE_SUCCESS,
} from 'redux/actionTypes/meetingDate';
import { NOTIFIER_TOAST_ADD } from 'redux/actionTypes/notifier';
import { Utils } from 'utils';
import { APIUtils } from 'utils/api';
import { DateUtils } from 'utils/date';

export function* removeMeetingDate(action: RemoveMeetingDateActionType) {
  try {
    yield call(
      axiosInstance.delete,
      `${APIEndpoints.MeetingDate}/${action.meetingDateId}`
    );
    yield put({ type: MEETING_DATE_REMOVE_SUCCESS });
    yield put({ type: MEETING_DATE_LOAD });
  } catch (error) {
    yield put({ type: MEETING_DATE_REMOVE_ERROR });
    yield put({
      type: NOTIFIER_TOAST_ADD,
      notifier: Utils.createNotifierToastForAxiosError(error as AxiosError),
    });
  }
}

export function* addMeetingDate(action: AddMeetingDateActionType) {
  try {
    yield call(axiosInstance.post, APIEndpoints.MeetingDate, {
      date: DateUtils.convertToAPIRequestDateString(action.date),
    });
    yield put({ type: MEETING_DATE_ADD_SUCCESS });
    yield put({ type: MEETING_DATE_LOAD });
  } catch (error) {
    yield put({ type: MEETING_DATE_ADD_ERROR });
    yield put({
      type: NOTIFIER_TOAST_ADD,
      notifier: Utils.createNotifierToastForAxiosError(error as AxiosError),
    });
  }
}

export const convertAPIResponse = (
  response: MeetingDateResponse[]
): MeetingDates => {
  const meetingDates = response.map(APIUtils.convertMeetingDateResponse);

  return { meetingDates };
};

function* fetchMeetingDates() {
  try {
    yield put({ type: MEETING_DATE_LOADING });
    const apiResponse: AxiosResponse<Array<MeetingDateResponse>> = yield call(
      axiosInstance.get,
      APIEndpoints.MeetingDate
    );

    const convertedResponse = convertAPIResponse(apiResponse.data);

    yield call(storeApiResults, convertedResponse);
  } catch (error) {
    yield put({ type: MEETING_DATE_ERROR, error });
  }
}

export function* storeApiResults(response: MeetingDates) {
  const { meetingDates } = response;

  yield put({
    type: MEETING_DATE_RECEIVED,
    meetingDates,
  });
}

export function* watchMeetingDates() {
  yield takeLatest(MEETING_DATE_LOAD, fetchMeetingDates);
  yield takeLatest(MEETING_DATE_ADD, addMeetingDate);
  yield takeLatest(MEETING_DATE_REMOVE, removeMeetingDate);
}
