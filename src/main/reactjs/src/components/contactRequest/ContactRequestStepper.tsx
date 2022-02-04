import { Step, StepLabel, Stepper } from '@mui/material';

import { stepsByIndex } from 'components/contactRequest/ContactRequestFormUtils';
import { CircularStepper } from 'components/elements/CircularStepper';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { useWindowProperties } from 'hooks/useWindowProperties';
import { contactRequestSelector } from 'redux/selectors/contactRequest';

export const ContactRequestStepper = () => {
  const { activeStep } = useAppSelector(contactRequestSelector);
  const { isPhone } = useWindowProperties();
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.steps',
  });

  const maxStep = Object.keys(stepsByIndex).length;
  const currentStep = activeStep + 1;
  const text = `${currentStep}/${maxStep}`;
  const value = currentStep * (100 / maxStep);

  return isPhone ? (
    <CircularStepper value={value} text={text} size={90} />
  ) : (
    <Stepper className="contact-request-page__stepper" activeStep={activeStep}>
      {Object.values(stepsByIndex).map((v) => (
        <Step key={v}>
          <StepLabel>{t(v)}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
