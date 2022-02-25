import { Divider, Grid, Paper } from '@mui/material';
import { FC, useEffect } from 'react';

import { MeetingDatesListing } from 'components/clerkTranslator/meetingDates/MeetingDatesListing';
import { MeetingDatesToggleFilters } from 'components/clerkTranslator/meetingDates/MeetingDatesToggleFilters';
import { H1, H2, Text } from 'components/elements/Text';
import { MeetingDatesPageSkeleton } from 'components/skeletons/MeetingDatesPageSkeleton';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { loadMeetingDates } from 'redux/actions/meetingDate';
import { meetingDateSelector } from 'redux/selectors/meetingDate';

export const MeetingDatesPage: FC = () => {
  const { status, meetingDates } = useAppSelector(meetingDateSelector);
  const isLoading = status === APIResponseStatus.InProgress;
  const dispatch = useAppDispatch();

  const { t } = useAppTranslation({ keyPrefix: 'akt.pages' });

  useEffect(() => {
    if (status === APIResponseStatus.NotStarted) {
      dispatch(loadMeetingDates);
    }
  }, [dispatch, status]);

  const renderMeetingDatesPageGrids = () => (
    <>
      <Grid item>
        <div
          className="columns gapped"
          data-testid="meeting-dates-page__heading"
        >
          <H2>{t('meetingDatesPage.title')}</H2>
          <Text>{`(${meetingDates.length})`}</Text>
        </div>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <div className="columns">
          <div className="meeting-dates-page__grid-container__date-controls grow columns">
            <MeetingDatesToggleFilters />
          </div>
        </div>
      </Grid>
      <Grid item>
        <MeetingDatesListing />
      </Grid>
    </>
  );

  return (
    <div className="meeting-dates-page">
      <H1>{t('clerkHomepage.title')}</H1>
      <Paper elevation={3}>
        <Grid
          container
          direction="column"
          className="meeting-dates-page__grid-container"
        >
          {isLoading ? (
            <MeetingDatesPageSkeleton />
          ) : (
            renderMeetingDatesPageGrids()
          )}
        </Grid>
      </Paper>
    </div>
  );
};
