import {
  ChosenTranslators,
  ChosenTranslatorsHeading,
  DisplayContactInfo,
  StepHeading,
  stepsByIndex,
} from 'components/contactRequest/ContactRequestFormUtils';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { contactRequestSelector } from 'redux/selectors/contactRequest';

export const PreviewAndSend = () => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.contactRequestForm.formLabels',
  });
  const { request } = useAppSelector(contactRequestSelector);

  return (
    <div className="rows">
      <StepHeading step={stepsByIndex[3]} />
      <div className="rows gapped">
        <ChosenTranslatorsHeading />
        <ChosenTranslators />
        <DisplayContactInfo />
        <H3>{t('message')}</H3>
        <CustomTextField
          disabled
          data-testid="contact-request-page__message-text"
          defaultValue={request?.message}
          InputProps={{
            readOnly: true,
          }}
          multiline
          fullWidth
        />
      </div>
    </div>
  );
};
