import { MEETING_DATE_ADD } from 'redux/actionTypes/addMeetingDate';

export const addMeetingDate = (date: Date) => ({
  type: MEETING_DATE_ADD,
  date,
});
