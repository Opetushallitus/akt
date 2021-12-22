import { Button } from '@mui/material';
import { useState } from 'react';

import {
  ErrorDialog,
  SuccessDialog,
  InfoDialog,
} from 'components/dialogs/Dialog';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { UIStates } from 'enums/app';
import {
  resetContactRequest,
  setContactRequest,
} from 'redux/actions/contactRequest';
import { displayUIState } from 'redux/actions/navigation';
import { Text } from 'components/elements/Text';
import { ContactRequest } from 'interfaces/contactRequest';
import { contactRequestSelector } from 'redux/selectors/contactRequest';

export const SuccessDialogWrapper = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.successDialog',
  });
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(true);
  const cleanUp = () => {
    dispatch(resetContactRequest);
    dispatch(displayUIState(UIStates.PublicTranslatorListing));
    setOpen(false);
  };

  return (
    <SuccessDialog
      title={t('title')}
      content={<Text>{t('description')}</Text>}
      actions={
        <Button
          data-testid="success-dialog__continue-btn"
          variant="contained"
          color="secondary"
          onClick={() => cleanUp()}
        >
          {t('continue')}
        </Button>
      }
      open={open}
      onClose={cleanUp}
    />
  );
};

export const ErrorDialogWrapper = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.errorDialog',
  });
  const dispatch = useAppDispatch();
  const request = useAppSelector(contactRequestSelector)
    .request as ContactRequest;
  const [open, setOpen] = useState(true);
  const cleanUp = () => {
    dispatch(setContactRequest(request));
    setOpen(false);
  };

  return (
    <ErrorDialog
      title={t('title')}
      content={<Text>{t('description')} akt@oph.fi</Text>}
      actions={
        <Button
          data-testid="error-dialog__back-btn"
          variant="contained"
          color="secondary"
          onClick={() => cleanUp()}
        >
          {t('back')}
        </Button>
      }
      open={open}
      onClose={cleanUp}
    />
  );
};

export const CancelRequestDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.cancelRequestDialog',
  });
  const dispatch = useAppDispatch();
  const cleanUp = () => {
    dispatch(resetContactRequest);
    dispatch(displayUIState(UIStates.PublicTranslatorListing));
    onClose();
  };

  return (
    <InfoDialog
      title={t('title')}
      content={<Text>{t('description')}</Text>}
      actions={
        <>
          <Button
            data-testid="cancel-dialog__back-btn"
            variant="outlined"
            color="secondary"
            onClick={onClose}
          >
            {t('back')}
          </Button>
          <Button
            data-testid="cancel-dialog__yes-btn"
            variant="contained"
            color="secondary"
            onClick={() => cleanUp()}
          >
            {t('yes')}
          </Button>
        </>
      }
      open={open}
      onClose={onClose}
    />
  );
};
