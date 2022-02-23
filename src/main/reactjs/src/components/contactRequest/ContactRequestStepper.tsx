import { Step, StepLabel, Stepper } from '@mui/material';

import { stepsByIndex } from 'components/contactRequest/ContactRequestFormUtils';
import { CircularStepper } from 'components/elements/CircularStepper';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { ContactRequestFormStep } from 'enums/contactRequest';
import { useWindowProperties } from 'hooks/useWindowProperties';
import { contactRequestSelector } from 'redux/selectors/contactRequest';

export const ContactRequestStepper = () => {
  const { activeStep } = useAppSelector(contactRequestSelector);
  const { isPhone } = useWindowProperties();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.steps',
  });
  const translateCommon = useCommonTranslation();
  const phasePrefix = translateCommon('phase');

  const maxStep = Object.keys(stepsByIndex).length;
  const currentStep = activeStep + 1;
  const text = `${currentStep}/${maxStep}`;
  const value = currentStep * (100 / maxStep);
  const stepAriaLabel = (step: ContactRequestFormStep) => {
    const phaseDescription = t(stepsByIndex[step]);
    const phaseNumberPart = `${step + 1}/${maxStep}`;
    if (step < activeStep) {
      return `${phasePrefix} ${phaseNumberPart}, ${t(
        'completed'
      )}: ${phaseDescription}`;
    } else if (step == activeStep) {
      return `${phasePrefix} ${phaseNumberPart}, ${t(
        'active'
      )}: ${phaseDescription}`;
    } else {
      return `${phasePrefix} ${phaseNumberPart}: ${phaseDescription}`;
    }
  };

  return isPhone ? (
    <CircularStepper
      value={value}
      phaseText={text}
      phaseDescription={t(stepsByIndex[activeStep])}
      size={90}
    />
  ) : (
    <Stepper className="contact-request-page__stepper" activeStep={activeStep}>
      {Object.values(stepsByIndex).map((v, i) => (
        <Step key={v}>
          <StepLabel
            aria-label={stepAriaLabel(i)}
            className={
              activeStep < i
                ? 'contact-request-page__stepper__step--disabled'
                : undefined
            }
          >
            {t(v)}
          </StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
