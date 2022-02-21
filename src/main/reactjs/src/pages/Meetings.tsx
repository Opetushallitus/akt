import { Button, Divider, Grid, Paper } from '@mui/material';
import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { MeetingDatesListing } from 'components/clerkTranslator/MeetingDatesListing';
import { MeetingsToggleFilters } from 'components/clerkTranslator/MeetingsToggleFilters';
import { H1, H2, Text } from 'components/elements/Text';
import { ClerkHomePageSkeleton } from 'components/skeletons/ClerkHomePageSkeleton';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color, Variant } from 'enums/app';
import { resetClerkTranslatorFilters } from 'redux/actions/clerkTranslator';
import { loadMeetingDates } from 'redux/actions/meetingDate';
import { selectFilteredSelectedIds } from 'redux/selectors/clerkTranslator';
import { meetingDateSelector } from 'redux/selectors/meetingDate';

export const ClerkHomePageControlButtons = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });
  const dispatch = useAppDispatch();
  const sendEmailButtonDisabled =
    useAppSelector(selectFilteredSelectedIds).length === 0;

  return (
    <>
      <Button
        color={Color.Secondary}
        variant={Variant.Outlined}
        onClick={() => dispatch(resetClerkTranslatorFilters)}
      >
        {t('emptyBtn')}
      </Button>
      <Button
        data-testid="clerk-translator-registry__send-email-btn"
        component={Link}
        to={AppRoutes.ClerkSendEmailPage}
        color={Color.Secondary}
        variant={Variant.Contained}
        disabled={sendEmailButtonDisabled}
      >
        {t('sendEmail')}
      </Button>
    </>
  );
};

export const Meetings: FC = () => {
  const { status } = useAppSelector(meetingDateSelector);
  const isLoading = status === APIResponseStatus.InProgress;
  const dispatch = useAppDispatch();

  const { t } = useAppTranslation({ keyPrefix: 'akt.pages.clerkHomepage' });

  useEffect(() => {
    if (status === APIResponseStatus.NotStarted) {
      dispatch(loadMeetingDates);
    }
  }, [dispatch, status]);

  const renderClerkHomePageGrids = () => (
    <>
      <Grid item>
        <div
          className="columns gapped"
          data-testid="clerk-translator-registry__heading"
        >
          <H2>Kokouspäivät</H2>
          <Text></Text>
          {/* <Text>{`(${meetings.length})`}</Text> */}
        </div>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <div className="columns">
          <div className="clerk-homepage__grid-container__register-controls grow columns">
            <MeetingsToggleFilters />
          </div>
        </div>
      </Grid>
      <Grid item>
        <Divider />
      </Grid>
      <Grid item>
        <MeetingDatesListing />
      </Grid>
    </>
  );

  return (
    <div className="clerk-homepage">
      <H1>{t('title')}</H1>
      <Paper elevation={3}>
        <Grid
          container
          direction="column"
          className="clerk-homepage__grid-container"
        >
          {isLoading ? <ClerkHomePageSkeleton /> : renderClerkHomePageGrids()}
        </Grid>
      </Paper>
    </div>
  );
};
