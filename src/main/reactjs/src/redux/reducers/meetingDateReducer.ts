import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import { MeetingStatus } from 'enums/meetingDate';
import {
  MeetingDate,
  MeetingDateAction,
  MeetingDateFilter,
  MeetingDateState,
} from 'interfaces/meetingDate';
import {
  MEETING_DATE_ADD_FILTER,
  MEETING_DATE_ERROR,
  MEETING_DATE_LOADING,
  MEETING_DATE_RECEIVED,
} from 'redux/actionTypes/meetingDate';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  meetingDates: [],
  filters: {
    meetingStatus: MeetingStatus.Upcoming,
  },
};

export const meetingDateReducer: Reducer<
  MeetingDateState,
  MeetingDateAction
> = (state = defaultState, action) => {
  const filters = action.filters as MeetingDateFilter;
  switch (action.type) {
    case MEETING_DATE_LOADING:
      return { ...state, status: APIResponseStatus.InProgress };
    case MEETING_DATE_RECEIVED:
      const meetingDates = action.meetingDates as Array<MeetingDate>;

      return {
        ...state,
        meetingDates,
        status: APIResponseStatus.Success,
      };
    case MEETING_DATE_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    case MEETING_DATE_ADD_FILTER:
      return {
        ...state,
        filters: { ...state.filters, ...filters },
      };
    default:
      return state;
  }
};
