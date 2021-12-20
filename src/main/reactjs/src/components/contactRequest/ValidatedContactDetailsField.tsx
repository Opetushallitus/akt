import { TextField, TextFieldProps } from '@mui/material';
import { useState, useEffect, Dispatch } from 'react';

import { useAppTranslation } from 'configs/i18n';
import { useAppSelector, useAppDispatch } from 'configs/redux';
import {
  ContactDetails,
  ContactRequest,
  ContactRequestAction,
} from 'interfaces/contactRequest';
import { setContactRequest } from 'redux/actions/contactRequest';
import { contactRequestSelector } from 'redux/selectors/contactRequest';

const onContactDetailsFieldChange = (
  dispatch: Dispatch<ContactRequestAction>,
  setFieldStateChanged: (changed: boolean) => void,
  request: ContactRequest,
  field: keyof ContactDetails,
  newValue: string
) => {
  setFieldStateChanged(true);
  const updated = Object.assign({}, request);
  updated[field] = newValue;
  dispatch(setContactRequest(updated));
};

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
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.formLabels',
  });
  const dispatch = useAppDispatch();
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
      onChange={(e) =>
        onContactDetailsFieldChange(
          dispatch,
          setFieldStateChanged,
          contactDetails,
          contactDetailsField,
          e.target.value
        )
      }
      {...rest}
    />
  );
};
