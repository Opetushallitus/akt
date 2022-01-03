import { Dispatch, SetStateAction } from 'react';
import { Step, StepLabel, Stepper, Button } from '@mui/material';

import { H1, H2, H3, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import {
  publicTranslatorsSelector,
  selectedPublicTranslatorsForLanguagePair,
} from 'redux/selectors/publicTranslator';
import { ContactRequestFormStep } from 'enums/contactRequest';
import { VerifySelectedTranslators } from 'components/contactRequest/steps/VerifySelectedTranslators';
import { FillContactDetails } from 'components/contactRequest/steps/FillContactDetails';
import { WriteMessage } from 'components/contactRequest/steps/WriteMessage';
import { PreviewAndSend } from 'components/contactRequest/steps/PreviewAndSend';
import { ContactRequest } from 'interfaces/contactRequest';
import { sendContactRequest } from 'redux/actions/contactRequest';

export const stepsByIndex = {
  0: 'verifySelectedTranslators',
  1: 'fillContactDetails',
  2: 'writeMessage',
  3: 'previewAndSend',
  4: 'done',
};

export const ChosenTranslatorsHeading = () => {
  const { filters } = useAppSelector(publicTranslatorsSelector);
  const { fromLang, toLang } = filters;
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component',
  });

  return (
    <div className="columns">
      <H3>{`${t('contactRequestForm.chosenTranslatorsForLanguagePair')}`}</H3>
      <H3 className="contact-request-page__lang-pair">
        {`${t('publicTranslatorFilters.languages.' + fromLang)} - ${t(
          'publicTranslatorFilters.languages.' + toLang
        )}`}
      </H3>
    </div>
  );
};

export const RenderChosenTranslators = () => {
  const translators = useAppSelector(selectedPublicTranslatorsForLanguagePair);
  const translatorsString = translators
    .map(({ firstName, lastName }) => firstName + ' ' + lastName)
    .join(', ');

  return (
    <Text data-testid="contact-request-page__chosen-translators-text">
      {translatorsString}
    </Text>
  );
};

export const DisplayContactInfo = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.formLabels',
  });
  const { request } = useAppSelector(contactRequestSelector);

  return (
    <div className="rows gapped">
      <H2>{t('contactInfo')}</H2>
      <div className="rows">
        <H3>{t('firstName')}</H3>
        <Text data-testid="contact-info__first-name-text">
          {request?.firstName}
        </Text>
      </div>
      <div className="rows">
        <H3>{t('lastName')}</H3>
        <Text data-testid="contact-info__last-name-text">
          {request?.lastName}
        </Text>
      </div>
      <div className="rows">
        <H3>{t('email')}</H3>
        <Text data-testid="contact-info__email-text">{request?.email}</Text>
      </div>
      {request?.phoneNumber && (
        <div className="rows">
          <H3>{t('phoneNumber')}</H3>
          <Text data-testid="contact-info__phone-number-text">
            {request.phoneNumber}
          </Text>
        </div>
      )}
    </div>
  );
};

export const StepHeading = ({ step }: { step: string }) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.steps',
  });

  return (
    <div
      className="contact-request-page__heading"
      data-testid={`contact-request-page__step-heading-${step}`}
    >
      <H1>{t(step)}</H1>
    </div>
  );
};

export const ContactRequestStepper = ({ step }: { step: number }) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.steps',
  });

  return (
    <Stepper className="contact-request-page__stepper" activeStep={step}>
      {Object.values(stepsByIndex).map((v) => (
        <Step key={v}>
          <StepLabel>{t(v)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

const decrementStep = (step: number) => step - 1;
const incrementStep = (step: number) => step + 1;

export const ControlButtons = ({
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
        data-testid="contact-request-page__cancel-btn"
      >
        {t('buttons.cancel')}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => onChangeStep(decrementStep)}
        disabled={step == minStep}
        data-testid="contact-request-page__previous-btn"
      >
        {t('buttons.previous')}
      </Button>
      {step == maxStep ? (
        <Button
          variant="contained"
          color="secondary"
          onClick={() => submit()}
          data-testid="contact-request-page__submit-btn"
        >
          {t('buttons.submit')}
        </Button>
      ) : (
        <Button
          variant="contained"
          color="secondary"
          disabled={disableNext}
          onClick={() => onChangeStep(incrementStep)}
          data-testid="contact-request-page__next-btn"
        >
          {t('buttons.next')}
        </Button>
      )}
    </div>
  );
};

export const StepContents = ({
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
