import { createSelector } from 'reselect';

import { RootState } from 'configs/redux';
import { MeetingStatus } from 'enums/meetingDate';
import { DateUtils } from 'utils/date';

export const meetingDateSelector = (state: RootState) => state.meetingDate;

export const selectMeetingDatesByMeetingStatus = createSelector(
  (state: RootState) => state.meetingDate.meetingDates,
  (meetingDates) => {
    // TODO Note that this has an *implicit* dependency on the current system time,
    // which we currently fail to take into account properly - the selectors should
    // somehow make the dependency on time explicit!
    const currentDate = DateUtils.dateAtStartOfDay(new Date());
    const upcoming = meetingDates.filter(({ date }) =>
      filterMeetingDatesByStatus(date, MeetingStatus.Upcoming, currentDate)
    );
    const passed = meetingDates.filter(({ date }) =>
      filterMeetingDatesByStatus(date, MeetingStatus.Passed, currentDate)
    );

    return {
      upcoming,
      passed,
    };
  }
);

const filterMeetingDatesByStatus = (
  date: Date,
  status: MeetingStatus,
  currentDate: Date
) => {
  if (status === MeetingStatus.Upcoming) {
    return !DateUtils.isDatePartBeforeOrEqual(date, currentDate);
  }

  return DateUtils.isDatePartBeforeOrEqual(date, currentDate);
};
