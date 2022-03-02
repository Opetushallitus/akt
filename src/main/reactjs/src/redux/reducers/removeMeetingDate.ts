import { Reducer } from 'redux';

import { APIResponseStatus } from 'enums/api';
import {
  RemoveMeetingDateAction,
  RemoveMeetingDateState,
} from 'interfaces/removeMeetingDate';
import {
  MEETING_DATE_REMOVE,
  MEETING_DATE_REMOVE_ERROR,
  MEETING_DATE_REMOVE_SUCCESS,
} from 'redux/actionTypes/addMeetingDate';

const defaultState = {
  status: APIResponseStatus.NotStarted,
  meetingDateId: undefined,
};

export const removeMeetingDateReducer: Reducer<
  RemoveMeetingDateState,
  RemoveMeetingDateAction
> = (state = defaultState, action) => {
  switch (action.type) {
    case MEETING_DATE_REMOVE:
      const { meetingDateId } = action;

      return { ...state, meetingDateId, status: APIResponseStatus.InProgress };
    case MEETING_DATE_REMOVE_SUCCESS:
      return { ...state, status: APIResponseStatus.Success };
    case MEETING_DATE_REMOVE_ERROR:
      return { ...state, status: APIResponseStatus.Error };
    default:
      return state;
  }
};
