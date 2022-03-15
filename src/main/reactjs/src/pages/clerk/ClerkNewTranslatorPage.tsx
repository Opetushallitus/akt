import { Box, Paper } from '@mui/material';
import { ChangeEvent, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { AddAuthorisation } from 'components/clerkTranslator/add/AddAuthorisation';
import { AuthorisationListing } from 'components/clerkTranslator/overview/AuthorisationListing';
import { ClerkTranslatorDetailsFields } from 'components/clerkTranslator/overview/ClerkTranslatorDetailsFields';
import { CustomButton } from 'components/elements/CustomButton';
import { H1 } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { APIResponseStatus } from 'enums/api';
import { AppRoutes, Color, Duration, Severity, Variant } from 'enums/app';
import { Authorisation } from 'interfaces/authorisation';
import { ClerkTranslatorBasicInformation } from 'interfaces/clerkTranslator';
import {
  resetNewClerkTranslatorDetails,
  resetNewClerkTranslatorRequestStatus,
  saveNewClerkTranslator,
  updateNewClerkTranslator,
} from 'redux/actions/clerkNewTranslator';
import { loadMeetingDates } from 'redux/actions/meetingDate';
import { showNotifierToast } from 'redux/actions/notifier';
import { clerkNewTranslatorSelector } from 'redux/selectors/clerkNewTranslator';
import { meetingDatesSelector } from 'redux/selectors/meetingDate';
import { Utils } from 'utils';

const NewTranslatorBasicInformation = () => {
  // Redux
  const { translator } = useAppSelector(clerkNewTranslatorSelector);
  const dispatch = useAppDispatch();

  const onTranslatorDetailsChange = (
    translatorDetails: ClerkTranslatorBasicInformation
  ) => {
    dispatch(updateNewClerkTranslator({ ...translator, ...translatorDetails }));
  };

  const handleTranslatorDetailsChange =
    (field: keyof ClerkTranslatorBasicInformation) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const fieldValue =
        field === 'isAssuranceGiven'
          ? (event.target as HTMLInputElement).checked
          : event.target.value;
      const updatedTranslatorDetails = {
        ...translator,
        [field]: fieldValue,
      };
      onTranslatorDetailsChange(updatedTranslatorDetails);
    };

  return (
    <ClerkTranslatorDetailsFields
      translator={translator}
      onFieldChange={(field: keyof ClerkTranslatorBasicInformation) =>
        handleTranslatorDetailsChange(field)
      }
      editDisabled={false}
    />
  );
};

const BottomControls = () => {
  // i18n
  const translateCommon = useCommonTranslation();

  // Redux
  const { translator } = useAppSelector(clerkNewTranslatorSelector);
  const dispatch = useAppDispatch();

  // Action handlers
  const onCancel = () => {
    dispatch(resetNewClerkTranslatorDetails);
    dispatch(resetNewClerkTranslatorRequestStatus);
  };
  const onSave = () => {
    dispatch(saveNewClerkTranslator(translator));
  };

  return (
    <div className="columns gapped flex-end">
      <CustomButton
        variant={Variant.Text}
        color={Color.Secondary}
        onClick={onCancel}
      >
        {translateCommon('cancel')}
      </CustomButton>
      <CustomButton
        variant={Variant.Contained}
        color={Color.Secondary}
        onClick={onSave}
      >
        {translateCommon('save')}
      </CustomButton>
    </div>
  );
};

export const ClerkNewTranslatorPage = () => {
  // i18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.pages.clerkNewTranslatorPage',
  });

  // Redux
  const { translator, status, createdTranslatorId } = useAppSelector(
    clerkNewTranslatorSelector
  );
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
        AppRoutes.ClerkTranslatorOverviewPage.replace(
          /:translatorId$/,
          `${createdTranslatorId}`
        )
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
  }, [createdTranslatorId, dispatch, navigate, status, t]);

  return (
    <Box className="clerk-translator-overview-page">
      <H1>{t('title')}</H1>
      <Paper
        elevation={3}
        className="clerk-translator-overview-page__content-container rows"
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
