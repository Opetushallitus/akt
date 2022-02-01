import { ChangeEvent, useEffect, useState } from 'react';

import {
  ChosenTranslatorsHeading,
  RenderChosenTranslators,
  StepHeading,
  stepsByIndex,
} from 'components/contactRequest/ContactRequestFormUtils';
import { H3 } from 'components/elements/Text';
import { TextBox } from 'components/elements/TextBox';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { TextBoxTypes } from 'enums/app';
import { ContactDetails } from 'interfaces/contactRequest';
import { setContactRequest } from 'redux/actions/contactRequest';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import { Utils } from 'utils';

export const FillContactDetails = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt',
  });

  // State
  const [fieldErrors, setFieldErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
  });

  // Redux
  const dispatch = useAppDispatch();
  const { request } = useAppSelector(contactRequestSelector);

  useEffect(() => {
    const requiredFieldValues = [
      request?.firstName,
      request?.lastName,
      request?.email,
    ];
    const hasFieldErrors = Object.values(fieldErrors).some((v) => v);
    const hasEmptyRequiredFields = requiredFieldValues.some((v) => !!!v);

    disableNext(hasFieldErrors || hasEmptyRequiredFields);
  }, [fieldErrors, disableNext, request]);

  const handleContactDetailsChange =
    (fieldName: keyof ContactDetails) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (fieldErrors[fieldName]) {
        handleContactDetailsErrors(fieldName)(event);
      }

      dispatch(
        setContactRequest({
          [fieldName]: event.target.value,
        })
      );
    };

  const handleContactDetailsErrors =
    (fieldName: keyof ContactDetails) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { type, value, required } = event.target;
      const error = Utils.inspectTextBoxErrors(
        type as TextBoxTypes,
        value,
        required
      );

      const errorMessage = error ? t(error) : '';
      setFieldErrors({ ...fieldErrors, [fieldName]: errorMessage });
    };

  const showTextBoxError = (fieldName: keyof ContactDetails) => {
    return fieldErrors[fieldName]?.length > 0;
  };

  const getTextBoxAttributes = (fieldName: keyof ContactDetails) => ({
    id: `contact-details__${fieldName}-field`,
    label: t(`component.contactRequestForm.formLabels.${fieldName}`),
    onBlur: handleContactDetailsErrors(fieldName),
    onChange: handleContactDetailsChange(fieldName),
    error: showTextBoxError(fieldName),
    helperText: fieldErrors[fieldName],
  });

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[1]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <RenderChosenTranslators />
        <div className="rows gapped">
          <H3>{t('component.contactRequestForm.steps.' + stepsByIndex[1])}</H3>
          <div className="grid-columns gapped">
            <TextBox
              {...getTextBoxAttributes('firstName')}
              value={request?.firstName}
              type={TextBoxTypes.Text}
              required
            />
            <TextBox
              {...getTextBoxAttributes('lastName')}
              type={TextBoxTypes.Text}
              value={request?.lastName}
              required
            />
          </div>
          <div className="grid-columns gapped">
            <TextBox
              {...getTextBoxAttributes('email')}
              type={TextBoxTypes.Email}
              value={request?.email}
              required
            />
            <TextBox
              {...getTextBoxAttributes('phoneNumber')}
              value={request?.phoneNumber}
              type={TextBoxTypes.PhoneNumber}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
