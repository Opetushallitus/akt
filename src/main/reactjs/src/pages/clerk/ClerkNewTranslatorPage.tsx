import { Box, Paper } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { AddAuthorisation } from 'components/clerkTranslator/add/AddAuthorisation';
import { BottomControls } from 'components/clerkTranslator/new/BottomControls';
import { NewTranslatorBasicInformation } from 'components/clerkTranslator/new/NewTranslatorBasicInformation';
import { AuthorisationListing } from 'components/clerkTranslator/overview/AuthorisationListing';
import { H1 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Duration, Severity } from 'enums/app';
import { Authorisation } from 'interfaces/authorisation';
import {
  resetNewClerkTranslatorDetails,
  resetNewClerkTranslatorRequestStatus,
  updateNewClerkTranslator,
} from 'redux/actions/clerkNewTranslator';
import { loadMeetingDates } from 'redux/actions/meetingDate';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkNewTranslatorSelector } from 'redux/selectors/clerkNewTranslator';
import { meetingDatesSelector } from 'redux/selectors/meetingDate';
import { Utils } from 'utils';

export const ClerkNewTranslatorPage = () => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.clerkNewTranslatorPage',
  });

  // Redux
  const { translator, status, id } = useAppSelector(clerkNewTranslatorSelector);
  const meetingDatesState = useAppSelector(meetingDatesSelector).meetingDates;

  const dispatch = useAppDispatch();
  const onAuthorisationAdd = (authorisation: Authorisation) => {
    dispatch(
      updateNewClerkTranslator({
        ...translator,
        authorisations: [...translator.authorisations, authorisation],
      })
    );
  };

  // Navigation
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !meetingDatesState.meetingDates.length &&
      meetingDatesState.status === APIResponseStatus.NotStarted
    ) {
      dispatch(loadMeetingDates);
    }
  }, [dispatch, meetingDatesState]);

  useEffect(() => {
    if (status === APIResponseStatus.Success) {
      const successToast = Utils.createNotifierToast(
        Severity.Success,
        t('toasts.success'),
        Duration.Medium
      );
      dispatch(resetNewClerkTranslatorRequestStatus);
      dispatch(resetNewClerkTranslatorDetails);
      dispatch(showNotifierToast(successToast));
      navigate(
        AppRoutes.ClerkTranslatorOverviewPage.replace(/:translatorId$/, `${id}`)
      );
    } else if (status === APIResponseStatus.Error) {
      const errorToast = Utils.createNotifierToast(
        Severity.Error,
        t('toasts.error'),
        Duration.Long
      );
      dispatch(showNotifierToast(errorToast));
      dispatch(resetNewClerkTranslatorRequestStatus);
    }
  }, [id, dispatch, navigate, status, t]);

  return (
    <Box className="clerk-new-translator-page">
      <H1>{t('title')}</H1>
      <Paper
        elevation={3}
        className="clerk-new-translator-page__content-container rows"
      >
        <div className="rows gapped">
          <NewTranslatorBasicInformation />
          <AddAuthorisation
            meetingDates={meetingDatesState.meetingDates}
            onAuthorisationAdd={onAuthorisationAdd}
          />
          {translator.authorisations.length ? (
            <AuthorisationListing authorisations={translator.authorisations} />
          ) : null}
          <BottomControls />
        </div>
      </Paper>
    </Box>
  );
};
