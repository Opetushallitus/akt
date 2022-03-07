import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import { MeetingStatus } from 'enums/meetingDate';
import { DateUtils } from 'utils/date';

export const meetingDatesSelector = (state: RootState) => state.meetingDate;

export const selectMeetingDatesByMeetingStatus = createSelector(
  (state: RootState) => state.meetingDate.meetingDates,
  (meetingDates) => {
    // TODO Note that this has an *implicit* dependency on the current system time,
    // which we currently fail to take into account properly - the selectors should
    // somehow make the dependency on time explicit!
    const currentDate = new Date();
    const upcoming = meetingDates.meetingDates
      .filter(({ date }) =>
        filterMeetingDateByStatus(date, MeetingStatus.Upcoming, currentDate)
      )
      .sort((a, b) => a.date - b.date);

    const passed = meetingDates.meetingDates
      .filter(({ date }) =>
        filterMeetingDateByStatus(date, MeetingStatus.Passed, currentDate)
      )
      .sort((a, b) => b.date - a.date);

    return {
      upcoming,
      passed,
    };
  }
);

const filterMeetingDateByStatus = (
  date: Date,
  status: MeetingStatus,
  currentDate: Date
) => {
  const isBefore = DateUtils.isDatePartBefore(date, currentDate);

  return status === MeetingStatus.Upcoming ? !isBefore : isBefore;
};
