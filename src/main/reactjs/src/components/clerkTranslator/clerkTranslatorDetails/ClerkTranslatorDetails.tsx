import { CustomButton } from 'components/elements/CustomButton';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
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
    keyPrefix: 'akt.component.clerkTranslatorOverview.translatorDetails.fields',
  });

  return (
    <CustomTextField
      data-testid={`clerk-translator-overview__translator-details__field-${field}`}
      label={t(field)}
      value={translator[field]}
      disabled={disabled}
    />
  );
};

export const ClerkTranslatorDetails = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.translatorDetails',
  });
  const translateCommon = useCommonTranslation();
  const renderTranslatorField = (field: keyof ClerkTranslator) => (
    <TranslatorField translator={translator} field={field} disabled />
  );

  return (
    <>
      <div className="columns margin-top-lg">
        <H3 className="grow">{t('header.personalInformation')}</H3>
        <CustomButton
          data-testid="clerk-translator-overview__translator-details__edit-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
        >
          {translateCommon('edit')}
        </CustomButton>
      </div>
      <div className="grid-columns gapped">
        {renderTranslatorField('lastName')}
        {renderTranslatorField('firstName')}
        {renderTranslatorField('identityNumber')}
      </div>
      <H3>{t('header.address')}</H3>
      <div className="grid-columns gapped">
        {renderTranslatorField('street')}
        {renderTranslatorField('postalCode')}
        {renderTranslatorField('town')}
        {renderTranslatorField('country')}
      </div>
      <H3>{t('header.contactInformation')}</H3>
      <div className="grid-columns gapped">
        {renderTranslatorField('email')}
        {renderTranslatorField('phoneNumber')}
      </div>
      <H3>{t('header.extraInformation')}</H3>
      <div className="grid-columns gapped">
        <CustomTextField
          data-testid={
            'clerk-translator-overview__translator-details__field-extraInformation'
          }
          value={translator.extraInformation}
          multiline
          fullWidth
          disabled
        />
      </div>
    </>
  );
};
