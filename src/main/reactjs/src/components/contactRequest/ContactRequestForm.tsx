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
import {
  VerifyTranslatorsStep,
  FillContactDetailsStep,
  WriteMessageStep,
  PreviewAndSendStep,
  ContactRequestStepper,
} from 'components/contactRequest/ContactRequestFormSteps';
import { ContactRequestFormStep } from 'enums/contactRequest';

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
    <div className="columns flex-end gapped">
      <Button variant="outlined" color="secondary" onClick={onCancelRequest}>
        {t('buttons.cancel')}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onChangeStep(decrementStep)}
        disabled={step == minStep}
      >
        {t('buttons.previous')}
      </Button>
      {step == maxStep ? (
        <Button variant="contained" color="secondary" onClick={() => submit()}>
          {t('buttons.submit')}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          disabled={disableNext}
          onClick={() => onChangeStep(incrementStep)}
        >
          {t('buttons.next')}
        </Button>
      )}
    </div>
  );
};

const useResetContactRequestState = () => {
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
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        phoneNumber: '',
      })
    );
  }, [dispatch, from, to, selectedTranslators]);
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
      return <VerifyTranslatorsStep disableNext={disableNext} />;
    case ContactRequestFormStep.FillContactDetails:
      return <FillContactDetailsStep disableNext={disableNext} />;
    case ContactRequestFormStep.WriteMessage:
      return <WriteMessageStep disableNext={disableNext} />;
    case ContactRequestFormStep.PreviewAndSend:
      return <PreviewAndSendStep />;
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

export const ContactRequestForm = () => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });

  // Redux
  useResetContactRequestState();

  // Local component state
  const [step, setStep] = useState(0);
  const [disableNext, setDisableNext] = useState(false);
  const maxStep = 3;
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);

  const disableNextCb = (disabled: boolean) => setDisableNext(disabled);
  return (
    <>
      <Grid item>
        <H1>{t('title')}</H1>
        <Text>{t('description')}</Text>
      </Grid>
      <Grid item>
        <Paper elevation={3}>
          <Box className="contact-request-form__form-container-box">
            <Box className="contact-request-form__inner-content-box">
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
    </>
  );
};