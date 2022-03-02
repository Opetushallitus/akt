import {
  MEETING_DATE_ADD,
  MEETING_DATE_REMOVE,
} from 'redux/actionTypes/addMeetingDate';

export const addMeetingDate = (date: Date) => ({
  type: MEETING_DATE_ADD,
  date,
});

export const removeMeetingDate = (meetingDateId: number) => ({
  type: MEETING_DATE_REMOVE,
  meetingDateId,
});
