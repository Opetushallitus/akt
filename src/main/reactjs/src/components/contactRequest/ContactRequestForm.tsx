import {
  Grid,
  Paper,
  Button,
  Box,
  Stepper,
  StepLabel,
  Step,
  IconButton,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextFieldProps,
} from '@mui/material';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import { H1, H2, H3, Text } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { UiStates } from 'enums/app';
import {
  resetContactRequest,
  sendContactRequest,
  setContactRequest,
} from 'redux/actions/contactRequest';
import { displayUiState } from 'redux/actions/navigation';
import { removeSelectedTranslator } from 'redux/actions/translatorDetails';
import { ContactDetails, ContactRequest } from 'interfaces/contactRequest';
import { APIResponseStatus } from 'enums/api';
import { ProgressIndicator } from 'components/elements/ProgressIndicator';
import { selectedPublicTranslatorsForLanguagePair } from 'redux/selectors/translatorDetails';

const decrementStep = (step: number) => step - 1;
const incrementStep = (step: number) => step + 1;

const ChosenTranslatorsHeading = () => {
  const fromLang = useAppSelector(
    (state) => state.translatorDetails.filters.fromLang
  );
  const toLang = useAppSelector(
    (state) => state.translatorDetails.filters.toLang
  );
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
  const contactInfo = useAppSelector(
    (state) => state.contactRequest.request
  ) as ContactRequest;

  return (
    <div className="rows gapped">
      <H2>{t('contactInfo')}</H2>
      <div className="rows">
        <H3>{t('firstName')}</H3>
        <Text>{contactInfo.firstName}</Text>
      </div>
      <div className="rows">
        <H3>{t('lastName')}</H3>
        <Text>{contactInfo.lastName}</Text>
      </div>
      <div className="rows">
        <H3>{t('email')}</H3>
        <Text>{contactInfo.email}</Text>
      </div>
      {contactInfo.phoneNumber && (
        <div className="rows">
          <H3>{t('phoneNumber')}</H3>
          <Text>{contactInfo.phoneNumber}</Text>
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

const VerifyTranslatorsStep = ({
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

const ContactDetailsField = ({
  contactDetailsField,
  isValidCallback,
  ...rest
}: TextFieldProps & {
  contactDetailsField: keyof ContactDetails;
  isValidCallback: (field: keyof ContactDetails, error: boolean) => void;
}) => {
  const contactDetails = useAppSelector(
    (state) => state.contactRequest.request
  ) as ContactRequest;
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

const FillContactDetailsStep = ({
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
          <ContactDetailsField
            contactDetailsField="firstName"
            isValidCallback={memoizedFieldErrorCallback}
            required
          />
          <ContactDetailsField
            contactDetailsField="lastName"
            isValidCallback={memoizedFieldErrorCallback}
            required
          />
          <ContactDetailsField
            contactDetailsField="email"
            isValidCallback={memoizedFieldErrorCallback}
            required
          />
          <ContactDetailsField
            contactDetailsField="phoneNumber"
            isValidCallback={memoizedFieldErrorCallback}
          />
        </div>
      </div>
    </div>
  );
};

const WriteMessageStep = ({
  disableNext,
}: {
  disableNext: (disabled: boolean) => void;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const request = useAppSelector(
    (state) => state.contactRequest.request
  ) as ContactRequest;
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

const PreviewAndSendStep = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const request = useAppSelector(
    (state) => state.contactRequest.request
  ) as ContactRequest;

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

const SuccessDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.successDialog',
  });
  const dispatch = useAppDispatch();
  const cleanUp = () => {
    dispatch(resetContactRequest);
    dispatch(displayUiState(UiStates.PublicTranslatorListing));
    onClose();
  };

  return (
    <Dialog className="dialog__success" open={open} onClose={cleanUp}>
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        <Text>{t('description')}</Text>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={() => cleanUp()}>
          {t('continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ErrorDialog = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.errorDialog',
  });
  const dispatch = useAppDispatch();
  const request = useAppSelector(
    (state) => state.contactRequest.request
  ) as ContactRequest;
  const cleanUp = () => {
    dispatch(setContactRequest(request));
    onClose();
  };

  return (
    <Dialog className="dialog__error" open={open} onClose={cleanUp}>
      <DialogTitle>{t('title')}</DialogTitle>
      <DialogContent>
        <Text>{t('description')} akt@oph.fi</Text>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="secondary" onClick={() => cleanUp()}>
          {t('back')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ControlButtons = ({
  onCancelRequest,
  onChangeStep,
  step,
  maxStep,
  disableNext,
}: {
  onCancelRequest: () => void;
  onChangeStep: Dispatch<SetStateAction<number>>;
  step: number;
  maxStep: number;
  disableNext: boolean;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });

  const dispatch = useAppDispatch();
  const contactRequest = useAppSelector(
    (state) => state.contactRequest.request
  ) as ContactRequest;
  const submit = () => {
    dispatch(sendContactRequest(contactRequest));
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
        disabled={step == 0}
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
  const from = useAppSelector(
    (state) => state.translatorDetails.filters.fromLang
  );
  const to = useAppSelector((state) => state.translatorDetails.filters.toLang);
  const translatorIds = useAppSelector(
    (state) => state.translatorDetails.selectedTranslators
  );
  useEffect(() => {
    dispatch(
      setContactRequest({
        languagePair: { from, to },
        translatorIds,
        email: '',
        firstName: '',
        lastName: '',
        message: '',
        phoneNumber: '',
      })
    );
  }, [dispatch, from, to, translatorIds]);
};

export const ContactRequestForm = () => {
  // I18
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  // Redux
  const dispatch = useAppDispatch();
  const onCancelRequest = () => {
    dispatch(resetContactRequest);
    dispatch(displayUiState(UiStates.PublicTranslatorListing));
  };
  useResetContactRequestState();
  const requestStatus = useAppSelector((state) => state.contactRequest.status);

  // Local component state
  const [step, setStep] = useState(0);
  const [disableNext, setDisableNext] = useState(false);
  const maxStep = 3;
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [spinnerOpen, setSpinnerOpen] = useState(false);

  useEffect(() => {
    switch (requestStatus) {
      case APIResponseStatus.InProgress:
        setSpinnerOpen(true);
        return;
      case APIResponseStatus.Success:
        setSpinnerOpen(false);
        setSuccessDialogOpen(true);
        return;
      case APIResponseStatus.Error:
        setSpinnerOpen(false);
        setErrorDialogOpen(true);
        return;
      default:
        setSpinnerOpen(false);
        setSuccessDialogOpen(false);
        setErrorDialogOpen(false);
    }
  }, [requestStatus, setSpinnerOpen, setSuccessDialogOpen, setErrorDialogOpen]);

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
              <Stepper
                className="contact-request-form__stepper"
                activeStep={step}
              >
                {[0, 1, 2, 3, 4].map((e) => (
                  <Step key={e}>
                    <StepLabel>{t('steps.' + e)}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              {step == 0 && (
                <VerifyTranslatorsStep disableNext={disableNextCb} />
              )}
              {step == 1 && (
                <FillContactDetailsStep disableNext={disableNextCb} />
              )}
              {step == 2 && <WriteMessageStep disableNext={disableNextCb} />}
              {step == 3 && <PreviewAndSendStep />}
              <SuccessDialog
                open={successDialogOpen}
                onClose={() => setSuccessDialogOpen(false)}
              />
              <ErrorDialog
                open={errorDialogOpen}
                onClose={() => setErrorDialogOpen(false)}
              />
              {spinnerOpen && <ProgressIndicator />}
            </Box>
            {step <= maxStep && (
              <ControlButtons
                step={step}
                maxStep={maxStep}
                disableNext={disableNext}
                onChangeStep={setStep}
                onCancelRequest={onCancelRequest}
              />
            )}
          </Box>
        </Paper>
      </Grid>
    </>
  );
};
