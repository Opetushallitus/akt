import { Button } from '@mui/material';

import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, Variant } from 'enums/app';
import { MeetingStatus } from 'enums/meetingDate';
import { setMeetingDateFilters } from 'redux/actions/meetingDate';
import {
  meetingDateSelector,
  selectMeetingDatesByMeetingStatus,
} from 'redux/selectors/meetingDate';

export const MeetingsToggleFilters = () => {
  const { upcoming, passed } = useAppSelector(
    selectMeetingDatesByMeetingStatus
  );
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.meetingDates',
  });
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(meetingDateSelector);
  const filterByDate = (status: MeetingStatus) => {
    dispatch(setMeetingDateFilters({ meetingStatus: status }));
  };
  const variantForStatus = (status: MeetingStatus) => {
    return status === filters.meetingStatus
      ? Variant.Contained
      : Variant.Outlined;
  };

  const countsForStatuses = [
    { status: MeetingStatus.Upcoming, count: upcoming.length },
    { status: MeetingStatus.Passed, count: passed.length },
  ];

  return (
    <>
      {countsForStatuses.map(({ count, status }, i) => (
        <Button
          key={i}
          data-testid={`clerk-translator-filters__btn--${status}`}
          color={Color.Secondary}
          variant={variantForStatus(status)}
          onClick={() => filterByDate(status)}
        >
          <div className="columns gapped">
            <div className="grow">{t(status)}</div>
            <div>{`(${count})`}</div>
          </div>
        </Button>
      ))}
    </>
  );
};
