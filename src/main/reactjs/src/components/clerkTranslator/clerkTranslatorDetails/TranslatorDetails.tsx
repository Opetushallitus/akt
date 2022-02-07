import { Button } from '@mui/material';

import { CustomTextField } from 'components/elements/CustomTextField';
import { H2 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { Color, Variant } from 'enums/app';
import { ClerkTranslator } from 'interfaces/clerkTranslator';

const TranslatorField = ({
  translator,
  field,
  disabled,
}: {
  translator: ClerkTranslator;
  field: keyof ClerkTranslator;
  disabled?: boolean;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails.translatorDetails.fields',
  });

  return (
    <CustomTextField
      data-testid={`clerk-translator-details__translator-details__field-${field}`}
      label={t(field)}
      value={translator[field]}
      disabled={disabled}
    />
  );
};

export const TranslatorDetails = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails.translatorDetails',
  });
  const translatorField = (field: keyof ClerkTranslator) => (
    <TranslatorField translator={translator} field={field} disabled />
  );

  return (
    <>
      <div className="columns">
        <H2 className="grow">{t('header.personalInformation')}</H2>
        <Button
          data-testid="clerk-translator-details__translator-details__edit-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
        >
          {t('buttons.edit')}
        </Button>
      </div>
      <div className="grid-columns gapped">
        {translatorField('lastName')}
        {translatorField('firstName')}
        {translatorField('identityNumber')}
      </div>
      <H2>{t('header.address')}</H2>
      <div className="grid-columns gapped">
        {translatorField('street')}
        {translatorField('postalCode')}
        {translatorField('town')}
        {translatorField('country')}
      </div>
      <H2>{t('header.contactInformation')}</H2>
      <div className="grid-columns gapped">
        {translatorField('email')}
        {translatorField('phoneNumber')}
      </div>
      <H2>{t('header.extraInformation')}</H2>
      <div className="grid-columns gapped">
        <CustomTextField
          data-testid={
            'clerk-translator-details__translator-details__field-extraInformation'
          }
          value={translator.extraInformation}
          multiline
          fullWidth
          rows={4}
          disabled
        />
      </div>
    </>
  );
};
