import { IconButton, Step, StepLabel, Stepper, TextField } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { H1, H2, H3, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import { ContactDetails, ContactRequest } from 'interfaces/contactRequest';
import { setContactRequest } from 'redux/actions/contactRequest';
import { removeSelectedTranslator } from 'redux/actions/publicTranslator';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import {
  publicTranslatorsSelector,
  selectedPublicTranslatorsForLanguagePair,
} from 'redux/selectors/publicTranslator';
import { ValidatedContactDetailsField } from './ValidatedContactDetailsField';

const stepsByIndex = {
  0: 'verifySelectedTranslators',
  1: 'fillContactDetails',
  2: 'writeMessage',
  3: 'previewAndSend',
  4: 'done',
};

const ChosenTranslatorsHeading = () => {
  const { filters } = useAppSelector(publicTranslatorsSelector);
  const { fromLang, toLang } = filters;
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component',
  });
  return (
    <H3>
      {t('contactRequestForm.chosenTranslatorsForLanguagePair')}{' '}
      {t('publicTranslatorFilters.languages.' + fromLang)} -{' '}
      {t('publicTranslatorFilters.languages.' + toLang)}{' '}
    </H3>
  );
};

const RenderChosenTranslators = () => {
  const translators = useAppSelector(selectedPublicTranslatorsForLanguagePair);
  const translatorsString = translators
    .map(({ firstName, lastName }) => firstName + ' ' + lastName)
    .join(', ');
  return (
    <Text data-testid="contact-request-form-chosen-translators">
      {translatorsString}
    </Text>
  );
};

const DisplayContactInfo = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.formLabels',
  });
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;

  return (
    <div className="rows gapped">
      <H2>{t('contactInfo')}</H2>
      <div className="rows">
        <H3>{t('firstName')}</H3>
        <Text data-testid="contact-request-form-contact-info-first-name">
          {request.firstName}
        </Text>
      </div>
      <div className="rows">
        <H3>{t('lastName')}</H3>
        <Text data-testid="contact-request-form-contact-info-last-name">
          {request.lastName}
        </Text>
      </div>
      <div className="rows">
        <H3>{t('email')}</H3>
        <Text data-testid="contact-request-form-contact-info-email">
          {request.email}
        </Text>
      </div>
      {request.phoneNumber && (
        <div className="rows">
          <H3>{t('phoneNumber')}</H3>
          <Text data-testid="contact-request-form-contact-info-phone-number">
            {request.phoneNumber}
          </Text>
        </div>
      )}
    </div>
  );
};

const StepHeading = ({ step }: { step: string }) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.steps',
  });
  return (
    <div className="contact-request-form__heading">
      <H1>{t(step)}</H1>
    </div>
  );
};

export const ContactRequestStepper = ({ step }: { step: number }) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.steps',
  });
  return (
    <Stepper className="contact-request-form__stepper" activeStep={step}>
      {Object.values(stepsByIndex).map((v) => (
        <Step key={v}>
          <StepLabel>{t(v)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

export const VerifyTranslatorsStep = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  const translators = useAppSelector(selectedPublicTranslatorsForLanguagePair);

  const dispatch = useAppDispatch();

  const deselectTranslator = (id: number) =>
    dispatch(removeSelectedTranslator(id));

  useEffect(
    () => disableNext(translators.length == 0),
    [disableNext, translators]
  );

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[0]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        {translators.map(({ id, firstName, lastName }) => (
          <div
            className="columns"
            key={id}
            data-testid={`contact-request-form-chosen-translator-id-${id}`}
          >
            <div className="grow">
              <Text>
                {firstName} {lastName}
              </Text>
            </div>
            <IconButton onClick={() => deselectTranslator(id)}>
              <DeleteOutlineIcon className="contact-request-form__delete-outline-icon" />
            </IconButton>
          </div>
        ))}
      </div>
    </div>
  );
};

export const FillContactDetailsStep = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });

  const [fieldErrors, setFieldErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phoneNumber: false,
  });

  const fieldErrorCallback = (field: keyof ContactDetails, error: boolean) =>
    setFieldErrors((state) => {
      const newState = Object.assign({}, state);
      newState[field] = error;
      return newState;
    });
  const memoizedFieldErrorCallback = useCallback(fieldErrorCallback, []);

  useEffect(
    () => disableNext(Object.values(fieldErrors).some((v) => v)),
    [fieldErrors, disableNext]
  );

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[1]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <div className="rows gapped">
          <H3>{t('steps.' + stepsByIndex[1])}</H3>
          <ValidatedContactDetailsField
            contactDetailsField="firstName"
            isValidCallback={memoizedFieldErrorCallback}
            required
          />
          <ValidatedContactDetailsField
            contactDetailsField="lastName"
            isValidCallback={memoizedFieldErrorCallback}
            required
          />
          <ValidatedContactDetailsField
            contactDetailsField="email"
            type="email"
            isValidCallback={memoizedFieldErrorCallback}
            required
          />
          <ValidatedContactDetailsField
            contactDetailsField="phoneNumber"
            isValidCallback={memoizedFieldErrorCallback}
          />
        </div>
      </div>
    </div>
  );
};

export const WriteMessageStep = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;
  const dispatch = useAppDispatch();

  useEffect(() => disableNext(request.message === ''), [disableNext, request]);

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[2]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <DisplayContactInfo />
        <div className="rows gapped">
          <H3>{t('steps.' + stepsByIndex[2])}</H3>
          <TextField
            id="contact-request-form-message-field"
            label={t('formLabels.writeMessageHere')}
            value={request.message}
            onChange={(e) =>
              dispatch(
                setContactRequest(
                  Object.assign({}, request, { message: e.target.value })
                )
              )
            }
            rows={5}
            multiline
            fullWidth
            required
          />
        </div>
      </div>
    </div>
  );
};

export const PreviewAndSendStep = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.formLabels',
  });
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[3]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <DisplayContactInfo />
        <H3>{t('message')}</H3>
        <Text data-testid="contact-request-form-message">
          {request.message}
        </Text>
      </div>
    </div>
  );
};
