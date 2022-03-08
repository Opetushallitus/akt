import { ToggleFilterGroup } from 'components/elements/ToggleFilterGroup';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { MeetingStatus } from 'enums/meetingDate';
import { setMeetingDateFilters } from 'redux/actions/meetingDate';
import {
  meetingDatesSelector,
  selectMeetingDatesByMeetingStatus,
} from 'redux/selectors/meetingDate';

export const MeetingDatesToggleFilters = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.meetingDatesToggleFilters',
  });

  const { upcoming, passed } = useAppSelector(
    selectMeetingDatesByMeetingStatus
  );

  const dispatch = useAppDispatch();
  const {
    meetingDates: { filters },
  } = useAppSelector(meetingDatesSelector);

  const filterByDate = (status: MeetingStatus) => {
    dispatch(setMeetingDateFilters({ meetingStatus: status }));
  };

  const filterData = [
    {
      status: MeetingStatus.Upcoming,
      count: upcoming.length,
      label: t(MeetingStatus.Upcoming),
    },
    {
      status: MeetingStatus.Passed,
      count: passed.length,
      label: t(MeetingStatus.Passed),
    },
  ];

  return (
    <ToggleFilterGroup
      filters={filterData}
      activeStatus={filters.meetingStatus}
      onButtonClick={filterByDate}
    />
  );
};
