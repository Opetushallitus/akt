import { AxiosResponse } from 'axios';
import { call, put, takeLatest } from 'redux-saga/effects';

import axiosInstance from 'configs/axios';
import { APIEndpoints } from 'enums/api';
import {
  MeetingDateAPIResponse,
  MeetingDateResponse,
} from 'interfaces/meetingDate';
import {
  // MEETING_DATE_ERROR,
  MEETING_DATE_LOAD,
  MEETING_DATE_LOADING,
  MEETING_DATE_RECEIVED,
} from 'redux/actionTypes/meetingDate';
import { APIUtils } from 'utils/api';

export const convertAPIResponse = (
  response: MeetingDateAPIResponse
): MeetingDateResponse => {
  const APIMeetingDates = response.meetingDates;
  const meetingDates = APIMeetingDates.map(APIUtils.convertAPIMeetingDate);

  return { meetingDates };
};

function* fetchMeetingDates() {
  try {
    yield put({ type: MEETING_DATE_LOADING });
    const apiResponse: AxiosResponse<MeetingDateAPIResponse> = yield call(
      axiosInstance.get,
      APIEndpoints.meetingDates
    );
    const convertedResponse = convertAPIResponse(apiResponse.data);

    yield call(storeApiResults, convertedResponse);
  } catch (error) {
    // yield put({ type: MEETING_DATE_ERROR, error });
    yield call(storeApiResults, { meetingDates: [] });
  }
}

export function* storeApiResults(response: MeetingDateResponse) {
  const { meetingDates } = response;

  const dummyMeetings = [
    { id: 1, date: new Date('2022-12-11') },
    { id: 2, date: new Date('2022-11-11') },
    { id: 3, date: new Date('2022-10-11') },
    { id: 4, date: new Date('2022-09-11') },
    { id: 5, date: new Date('2022-08-11') },
    { id: 6, date: new Date('2022-07-11') },
    { id: 7, date: new Date('2022-06-11') },
    { id: 8, date: new Date('2022-05-11') },
    { id: 9, date: new Date('2022-04-11') },
    { id: 10, date: new Date('2022-03-11') },
    { id: 11, date: new Date('2022-03-09') },
    { id: 12, date: new Date('2022-03-03') },
    { id: 13, date: new Date('2022-01-11') },
    { id: 14, date: new Date('2022-01-10') },
    { id: 15, date: new Date('2022-01-05') },
    { id: 16, date: new Date('2021-12-15') },
    { id: 17, date: new Date('2021-12-11') },
    { id: 18, date: new Date('2021-11-12') },
    { id: 19, date: new Date('2021-11-04') },
    { id: 20, date: new Date('2021-11-03') },
    { id: 21, date: new Date('2021-10-23') },
    { id: 22, date: new Date('2021-09-14') },
    { id: 23, date: new Date('2021-06-02') },
    { id: 24, date: new Date('2021-04-01') },
  ];
  yield put({
    type: MEETING_DATE_RECEIVED,
    meetingDates: [...meetingDates, ...dummyMeetings],
  });
}

export function* watchFetchMeetingDates() {
  yield takeLatest(MEETING_DATE_LOAD, fetchMeetingDates);
}
