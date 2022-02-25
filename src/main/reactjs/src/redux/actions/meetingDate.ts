import { MeetingDateFilter } from 'interfaces/meetingDate';
import {
  MEETING_DATE_ADD_FILTER,
  MEETING_DATE_LOAD,
} from 'redux/actionTypes/meetingDate';

export const loadMeetingDates = {
  type: MEETING_DATE_LOAD,
};

export const setMeetingDateFilters = (filters: MeetingDateFilter) => ({
  type: MEETING_DATE_ADD_FILTER,
  filters,
});
