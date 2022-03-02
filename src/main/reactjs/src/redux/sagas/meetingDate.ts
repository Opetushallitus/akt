import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import { MeetingDateResponse, MeetingDates } from 'interfaces/meetingDate';
import {
  MEETING_DATE_ERROR,
  MEETING_DATE_LOAD,
  MEETING_DATE_LOADING,
  MEETING_DATE_RECEIVED,
} from 'redux/actionTypes/meetingDate';
import { APIUtils } from 'utils/api';

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
      APIEndpoints.meetingDates
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

export function* watchFetchMeetingDates() {
  yield takeLatest(MEETING_DATE_LOAD, fetchMeetingDates);
}
