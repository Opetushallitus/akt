import {
  ArrowBackOutlined as ArrowBackIcon,
  ArrowForwardOutlined as ArrowForwardIcon,
} from '@mui/icons-material';
import { AppBar, Toolbar } from '@mui/material';

import { CustomButton } from 'components/elements/CustomButton';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppDispatch, useAppSelector } from 'configs/redux';
import { Color, Severity, Variant } from 'enums/app';
import { ContactRequestFormStep } from 'enums/contactRequest';
import { useWindowProperties } from 'hooks/useWindowProperties';
import { ContactRequest } from 'interfaces/contactRequest';
import {
  decreaseFormStep,
  increaseFormStep,
  sendContactRequest,
} from 'redux/actions/contactRequest';
import { showNotifierDialog } from 'redux/actions/notifier';
import {
  NOTIFIER_ACTION_CONTACT_REQUEST_RESET,
  NOTIFIER_ACTION_DO_NOTHING,
} from 'redux/actionTypes/notifier';
import { contactRequestSelector } from 'redux/selectors/contactRequest';
import { Utils } from 'utils';

export const ControlButtons = ({ disableNext }: { disableNext: boolean }) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm',
  });
  const translateCommon = useCommonTranslation();

  const { isPhone } = useWindowProperties();

  // Redux
  const dispatch = useAppDispatch();
  const { request, activeStep } = useAppSelector(contactRequestSelector) as {
    request: ContactRequest;
    activeStep: ContactRequestFormStep;
  };

  const submit = () => {
    dispatch(sendContactRequest(request));
  };

  const dispatchCancelNotifier = () => {
    const notifier = Utils.createNotifierDialog(
      t('cancelRequestDialog.title'),
      Severity.Info,
      t('cancelRequestDialog.description'),
      [
        {
          title: translateCommon('back'),
          variant: Variant.Outlined,
          action: NOTIFIER_ACTION_DO_NOTHING,
        },
        {
          title: translateCommon('yes'),
          variant: Variant.Contained,
          action: NOTIFIER_ACTION_CONTACT_REQUEST_RESET,
        },
      ]
    );

    dispatch(showNotifierDialog(notifier));
  };

  const dispatchStepIncrement = () => {
    dispatch(increaseFormStep);
  };

  const dispatchStepDecrement = () => {
    dispatch(decreaseFormStep);
  };

  const renderCancelButton = () => (
    <>
      <CustomButton
        variant={Variant.Text}
        color={Color.Secondary}
        onClick={dispatchCancelNotifier}
        data-testid="contact-request-page__cancel-btn"
      >
        {translateCommon('cancel')}
      </CustomButton>
    </>
  );

  const renderBackButton = () => (
    <CustomButton
      variant={Variant.Outlined}
      color={Color.Secondary}
      onClick={dispatchStepDecrement}
      disabled={activeStep == ContactRequestFormStep.VerifyTranslators}
      startIcon={<ArrowBackIcon />}
      data-testid="contact-request-page__previous-btn"
    >
      {translateCommon('back')}
    </CustomButton>
  );

  const renderNextAndSubmitButtons = () => (
    <>
      {activeStep == ContactRequestFormStep.PreviewAndSend ? (
        <CustomButton
          variant={Variant.Contained}
          color={Color.Secondary}
          onClick={() => submit()}
          data-testid="contact-request-page__submit-btn"
          endIcon={<ArrowForwardIcon />}
        >
          {translateCommon('send')}
        </CustomButton>
      ) : (
        <CustomButton
          variant={Variant.Contained}
          color={Color.Secondary}
          disabled={disableNext}
          onClick={dispatchStepIncrement}
          endIcon={<ArrowForwardIcon />}
          data-testid="contact-request-page__next-btn"
        >
          {translateCommon('next')}
        </CustomButton>
      )}
    </>
  );

  return isPhone ? (
    <AppBar className="contact-request-page__app-bar">
      <Toolbar className="contact-request-page__app-bar__tool-bar space-between">
        {activeStep === ContactRequestFormStep.VerifyTranslators &&
          renderCancelButton()}
        {activeStep !== ContactRequestFormStep.VerifyTranslators &&
          renderBackButton()}
        {renderNextAndSubmitButtons()}
      </Toolbar>
    </AppBar>
  ) : (
    <div className="columns flex-end gapped margin-top-xxl">
      {renderCancelButton()}
      {renderBackButton()}
      {renderNextAndSubmitButtons()}
    </div>
  );
};
