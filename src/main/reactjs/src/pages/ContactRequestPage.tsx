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
  StepContents,
} from 'components/contactRequest/ContactRequestFormUtils';
import { showNotifierDialog } from 'redux/actions/notifier';
import { Utils } from 'utils';
import { NotifierButtonVariant, NotifierSeverity } from 'enums/app';
import { NOTIFIER_ACTION_DO_NOTHING } from 'redux/actionTypes/notifier';
import { ControlButtons } from 'components/contactRequest/ControlButtons';
import { ContactRequestFormStep } from 'enums/contactRequest';

export const ContactRequestPage = () => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });

  // State
  const [disableNext, setDisableNext] = useState(false);

  // Redux
  const dispatch = useAppDispatch();
  const { status, activeStep } = useAppSelector(contactRequestSelector);
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

  const dispatchErrorNotifier = () => {
    const notifier = Utils.createNotifierDialog(
      t('errorDialog.title'),
      NotifierSeverity.Error,
      t('errorDialog.description'),
      [
        {
          title: t('errorDialog.back'),
          variant: NotifierButtonVariant.Contained,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

  const renderStatusChanges = () => {
    switch (status) {
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
              <ContactRequestStepper />
              <StepContents disableNext={disableNextCb} />
              {renderStatusChanges()}
            </Box>
            {activeStep <= ContactRequestFormStep.PreviewAndSend && (
              <ControlButtons disableNext={disableNext} />
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};
