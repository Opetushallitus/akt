import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  AddMeetingDateAction,
  AddMeetingDateState,
} from 'interfaces/addMeetingDate';
import {
  MEETING_DATE_ADD,
  MEETING_DATE_ADD_ERROR,
  MEETING_DATE_ADD_SUCCESS,
} from 'redux/actionTypes/addMeetingDate';
import { DateUtils } from 'utils/date';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  date: DateUtils.dateAtStartOfDay(new Date()),
};

export const addMeetingDateReducer: Reducer<
  AddMeetingDateState,
  AddMeetingDateAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case MEETING_DATE_ADD:
      const date = action.date as Date;

      return { ...state, date, status: APIResponseStatus.InProgress };
    case MEETING_DATE_ADD_SUCCESS:
      return { ...state, status: APIResponseStatus.Success };
    case MEETING_DATE_ADD_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    default:
      return state;
  }
};
