import DeleteIcon from '@mui/icons-material/DeleteOutline';
import { IconButton, TableCell, TableHead, TableRow } from '@mui/material';
import { Box } from '@mui/system';
import { FC } from 'react';

import { H3, Text } from 'components/elements/Text';
import { PaginatedTable } from 'components/tables/Table';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { MeetingStatus } from 'enums/meetingDate';
import { MeetingDate } from 'interfaces/meetingDate';
import { removeMeetingDate } from 'redux/actions/addMeetingDate';
import {
  meetingDateSelector,
  selectMeetingDatesByMeetingStatus,
} from 'redux/selectors/meetingDate';
import { DateUtils } from 'utils/date';

const getRowDetails = (meetingDate: MeetingDate) => {
  return <ListingRow meetingDate={meetingDate} />;
};

const ListingRow = ({ meetingDate }: { meetingDate: MeetingDate }) => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector(meetingDateSelector);

  const handleOnClick = (
    e: React.MouseEvent<HTMLAnchorElement> | undefined
  ) => {
    e?.stopPropagation();
    dispatch(removeMeetingDate(meetingDate.id));
  };

  return (
    <TableRow data-testid={`meeting-date__id-${meetingDate.id}-row`}>
      <TableCell>
        <Text>{DateUtils.formatOptionalDate(meetingDate.date)}</Text>
      </TableCell>
      {filters.meetingStatus === MeetingStatus.Upcoming && (
        <TableCell align="right">
          <IconButton onClick={handleOnClick}>
            <DeleteIcon className="contact-request-page__delete-outline-icon" />
          </IconButton>
        </TableCell>
      )}
    </TableRow>
  );
};

const ListingHeader: FC = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.meetingDatesListing',
  });
  const translateCommon = useCommonTranslation();
  const { filters } = useAppSelector(meetingDateSelector);

  return (
    <TableHead>
      <TableRow>
        <TableCell>
          <H3>{t('header')}</H3>
        </TableCell>
        {filters.meetingStatus === MeetingStatus.Upcoming && (
          <TableCell align="right">
            <H3>{translateCommon('delete')}</H3>
          </TableCell>
        )}
      </TableRow>
    </TableHead>
  );
};

export const MeetingDatesListing: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt' });
  const { status, filters } = useAppSelector(meetingDateSelector);
  const { upcoming, passed } = useAppSelector(
    selectMeetingDatesByMeetingStatus
  );

  switch (status) {
    case APIResponseStatus.NotStarted:
    case APIResponseStatus.InProgress:
    case APIResponseStatus.Cancelled:
    case APIResponseStatus.Error:
      return (
        <Box
          minHeight="10vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <H3>{t('errors.loadingFailed')}</H3>
        </Box>
      );
    case APIResponseStatus.Success:
      return (
        <PaginatedTable
          data={
            filters.meetingStatus === MeetingStatus.Upcoming ? upcoming : passed
          }
          header={<ListingHeader />}
          getRowDetails={getRowDetails}
          initialRowsPerPage={10}
          rowsPerPageOptions={[10, 20, 50]}
          className={'clerk-translator__listing table-layout-auto'}
          stickyHeader
        />
      );
  }
};
