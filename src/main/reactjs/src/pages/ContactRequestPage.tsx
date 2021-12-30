import { Grid, Paper, Button, Box } from '@mui/material';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { H1, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import {
  sendContactRequest,
  setContactRequest,
} from 'redux/actions/contactRequest';
import { ContactRequest } from 'interfaces/contactRequest';
import { APIResponseStatus } from 'enums/api';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { publicTranslatorsSelector } from 'redux/selectors/publicTranslator';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import {
  CancelRequestDialog,
  ErrorDialogWrapper,
  SuccessDialogWrapper,
} from 'components/contactRequest/ConnectedDialog';
import { ContactRequestFormStep } from 'enums/contactRequest';
import { VerifySelectedTranslators } from 'components/contactRequest/steps/VerifySelectedTranslators';
import { FillContactDetails } from 'components/contactRequest/steps/FillContactDetails';
import { WriteMessage } from 'components/contactRequest/steps/WriteMessage';
import { PreviewAndSend } from 'components/contactRequest/steps/PreviewAndSend';
import { ContactRequestStepper } from 'components/contactRequest/ContactRequestFormUtils';

const decrementStep = (step: number) => step - 1;
const incrementStep = (step: number) => step + 1;

const ControlButtons = ({
  onCancelRequest,
  onChangeStep,
  minStep,
  step,
  maxStep,
  disableNext,
}: {
  onCancelRequest: () => void;
  onChangeStep: Dispatch<SetStateAction<number>>;
  step: number;
  minStep: number;
  maxStep: number;
  disableNext: boolean;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });

  const dispatch = useAppDispatch();
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;
  const submit = () => {
    dispatch(sendContactRequest(request));
  };

  return (
    <div className="columns flex-end gapped m-margin-top">
      <Button
        variant="outlined"
        color="secondary"
        onClick={onCancelRequest}
        data-testid="contact-request-form__cancel-btn"
      >
        {t('buttons.cancel')}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onChangeStep(decrementStep)}
        disabled={step == minStep}
        data-testid="contact-request-form__previous-btn"
      >
        {t('buttons.previous')}
      </Button>
      {step == maxStep ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => submit()}
          data-testid="contact-request-form__submit-btn"
        >
          {t('buttons.submit')}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          disabled={disableNext}
          onClick={() => onChangeStep(incrementStep)}
          data-testid="contact-request-form__next-btn"
        >
          {t('buttons.next')}
        </Button>
      )}
    </div>
  );
};

const StepContents = ({
  step,
  disableNext,
}: {
  step: number;
  disableNext: (disabled: boolean) => void;
}) => {
  switch (step) {
    case ContactRequestFormStep.VerifyTranslators:
      return <VerifySelectedTranslators disableNext={disableNext} />;
    case ContactRequestFormStep.FillContactDetails:
      return <FillContactDetails disableNext={disableNext} />;
    case ContactRequestFormStep.WriteMessage:
      return <WriteMessage disableNext={disableNext} />;
    case ContactRequestFormStep.PreviewAndSend:
      return <PreviewAndSend />;
    default:
      return <> </>;
  }
};

const StatusNotifications = () => {
  const { status } = useAppSelector(contactRequestSelector);

  switch (status) {
    case APIResponseStatus.Success:
      return <SuccessDialogWrapper />;
    case APIResponseStatus.Error:
      return <ErrorDialogWrapper />;
    case APIResponseStatus.InProgress:
      return <ProgressIndicator />;
    default:
      return <> </>;
  }
};

export const ContactRequestPage = () => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  // State
  const [step, setStep] = useState(0);
  const [disableNext, setDisableNext] = useState(false);
  const maxStep = 3;
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  // Redux
  const dispatch = useAppDispatch();
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

  return (
    <div className="contact-request-form">
      <Grid item>
        <H1>{t('title')}</H1>
        <Text>{t('description')}</Text>
      </Grid>
      <Grid className="contact-request-form__grid" item>
        <Paper elevation={3}>
          <Box className="contact-request-form__grid__form-container">
            <Box className="contact-request-form__grid__inner-container">
              <ContactRequestStepper step={step} />
              <StepContents step={step} disableNext={disableNextCb} />
              <StatusNotifications />
              <CancelRequestDialog
                open={cancelDialogOpen}
                onClose={() => setCancelDialogOpen(false)}
              />
            </Box>
            {step <= maxStep && (
              <ControlButtons
                step={step}
                minStep={0}
                maxStep={maxStep}
                disableNext={disableNext}
                onChangeStep={setStep}
                onCancelRequest={() => setCancelDialogOpen(true)}
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </div>
  );
};
