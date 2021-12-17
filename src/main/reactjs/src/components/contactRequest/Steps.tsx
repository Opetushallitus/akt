import { IconButton, TextField } from '@mui/material';
import { useEffect, useState, useCallback } from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { H1, H2, H3, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import { ContactDetails, ContactRequest } from 'interfaces/contactRequest';
import { setContactRequest } from 'redux/actions/contactRequest';
import { removeSelectedTranslator } from 'redux/actions/translatorDetails';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import {
  publicTranslatorsSelector,
  selectedPublicTranslatorsForLanguagePair,
} from 'redux/selectors/translatorDetails';
import { ValidatedContactDetailsField } from './ValidatedContactDetailsField';

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
  return <Text>{translatorsString}</Text>;
};

const DisplayContactInfo = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;

  return (
    <div className="rows gapped">
      <H2>{t('contactInfo')}</H2>
      <div className="rows">
        <H3>{t('firstName')}</H3>
        <Text>{request.firstName}</Text>
      </div>
      <div className="rows">
        <H3>{t('lastName')}</H3>
        <Text>{request.lastName}</Text>
      </div>
      <div className="rows">
        <H3>{t('email')}</H3>
        <Text>{request.email}</Text>
      </div>
      {request.phoneNumber && (
        <div className="rows">
          <H3>{t('phoneNumber')}</H3>
          <Text>{request.phoneNumber}</Text>
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
      <StepHeading step="0" />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        {translators.map(({ id, firstName, lastName }) => (
          <div className="columns" key={id}>
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
      <StepHeading step="1" />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <div className="rows gapped">
          <H3>{t('steps.1')}</H3>
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
      <StepHeading step="2" />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <DisplayContactInfo />
        <div className="rows gapped">
          <H3>{t('steps.2')}</H3>
          <TextField
            label={t('writeMessageHereLabel')}
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
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;

  return (
    <div className="rows">
      <StepHeading step="3" />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <DisplayContactInfo />
        <H3>{t('message')}</H3>
        <Text>{request.message}</Text>
      </div>
    </div>
  );
};
