import { TextField, TextFieldProps } from '@mui/material';
import { useState, useEffect } from 'react';

import { useAppTranslation } from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import { ContactDetails, ContactRequest } from 'interfaces/contactRequest';
import { setContactRequest } from 'redux/actions/contactRequest';
import { contactRequestSelector } from 'redux/selectors/contactRequest';

export const ValidatedContactDetailsField = ({
  contactDetailsField,
  isValidCallback,
  ...rest
}: TextFieldProps & {
  contactDetailsField: keyof ContactDetails;
  isValidCallback: (field: keyof ContactDetails, error: boolean) => void;
}) => {
  const contactDetails = useAppSelector(contactRequestSelector)
    .request as ContactRequest;
  const dispatch = useAppDispatch();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const [fieldStateChanged, setFieldStateChanged] = useState(false);
  const isError = contactDetails[contactDetailsField] == '';
  const { required } = rest;
  useEffect(
    () => isValidCallback(contactDetailsField, !!required && isError),
    [isError, contactDetailsField, isValidCallback, required]
  );
  return (
    <TextField
      error={fieldStateChanged && isError}
      label={t(contactDetailsField)}
      value={contactDetails[contactDetailsField]}
      onChange={(e) => {
        setFieldStateChanged(true);
        const updated = Object.assign({}, contactDetails);
        updated[contactDetailsField] = e.target.value;
        dispatch(setContactRequest(updated));
      }}
      {...rest}
    />
  );
};
