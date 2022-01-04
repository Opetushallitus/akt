import { Grid, Paper, Box } from '@mui/material';
import { useEffect, useState } from 'react';

import { H1, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { setContactRequest } from 'redux/actions/contactRequest';
import { APIResponseStatus } from 'enums/api';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import {
  ContactRequestStepper,
  ControlButtons,
  StepContents,
} from 'components/contactRequest/ContactRequestFormUtils';
import { showNotifierDialog } from 'redux/actions/notifier';
import { Utils } from 'utils';
import { NotifierButtonVariant, NotifierSeverity } from 'enums/app';
import {
  NOTIFIER_ACTION_CONTACT_REQUEST_RESET,
  NOTIFIER_ACTION_DO_NOTHING,
} from 'redux/actionTypes/notifier';

export const ContactRequestPage = () => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  // State
  const [step, setStep] = useState(0);
  const [disableNext, setDisableNext] = useState(false);
  const maxStep = 3;
  // Redux
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(contactRequestSelector);
  const { filters, selectedTranslators } = useAppSelector(
    publicTranslatorsSelector
  );
  const { fromLang: from, toLang: to } = filters;

  useEffect(() => {
    dispatch(
      setContactRequest({
        languagePair: { from, to },
        translatorIds: selectedTranslators,
      })
    );
  }, [dispatch, from, to, selectedTranslators]);

  const disableNextCb = (disabled: boolean) => setDisableNext(disabled);

  const dispatchCancelNotifier = () => {
    const notifier = Utils.createNotifierDialog(
      t('cancelRequestDialog.title'),
      NotifierSeverity.Info,
      t('cancelRequestDialog.description'),
      [
        {
          title: t('cancelRequestDialog.back'),
          variant: NotifierButtonVariant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: t('cancelRequestDialog.yes'),
          variant: NotifierButtonVariant.Contained,
          action: NOTIFIER_ACTION_CONTACT_REQUEST_RESET,
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

  const dispatchSuccessNotifier = () => {
    const notifier = Utils.createNotifierDialog(
      t('successDialog.title'),
      NotifierSeverity.Success,
      t('successDialog.description'),
      [
        {
          title: t('successDialog.continue'),
          variant: NotifierButtonVariant.Contained,
          action: NOTIFIER_ACTION_CONTACT_REQUEST_RESET,
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

  const dispatchErrorNotifier = () => {
    const notifier = Utils.createNotifierDialog(
      t('errorDialog.title'),
      NotifierSeverity.Error,
      t('errorDialog.description'),
      [
        {
          title: t('successDialog.continue'),
          variant: NotifierButtonVariant.Contained,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

  const showStatusNotifications = () => {
    switch (status) {
      case APIResponseStatus.Success:
        dispatchSuccessNotifier();
        break;
      case APIResponseStatus.Error:
        dispatchErrorNotifier();
        break;
      case APIResponseStatus.InProgress:
        return <ProgressIndicator />;
      default:
        return <> </>;
    }
  };

  return (
    <Grid
      container
      rowSpacing={4}
      direction="column"
      className="contact-request-page"
    >
      <Grid item>
        <H1>{t('title')}</H1>
        <Text>{t('description')}</Text>
      </Grid>
      <Grid className="contact-request-page__grid" item>
        <Paper elevation={3}>
          <Box className="contact-request-page__grid__form-container">
            <Box className="contact-request-page__grid__inner-container">
              <ContactRequestStepper step={step} />
              <StepContents step={step} disableNext={disableNextCb} />
              {showStatusNotifications()}
            </Box>
            {step <= maxStep && (
              <ControlButtons
                step={step}
                minStep={0}
                maxStep={maxStep}
                disableNext={disableNext}
                onChangeStep={setStep}
                onCancelRequest={dispatchCancelNotifier}
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
