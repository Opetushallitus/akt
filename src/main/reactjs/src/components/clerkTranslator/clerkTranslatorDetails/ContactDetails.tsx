import { Button } from '@mui/material';

import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { Color, Variant } from 'enums/app';
import {
  ClerkTranslator,
  ClerkTranslatorContactDetails,
} from 'interfaces/clerkTranslator';

const ContactDetailsField = ({
  contactDetails,
  field,
  disabled,
}: {
  contactDetails: ClerkTranslatorContactDetails;
  field: keyof ClerkTranslatorContactDetails;
  disabled?: boolean;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails.contactDetails.fields',
  });

  return (
    <CustomTextField
      data-testid={`clerk-translator-details__contact-details__field-${field}`}
      label={t(field)}
      value={contactDetails[field]}
      disabled={disabled}
    />
  );
};

export const ContactDetails = ({
  translator,
}: {
  translator: ClerkTranslator;
}) => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorDetails.contactDetails',
  });
  const contactDetailsField = (field: keyof ClerkTranslatorContactDetails) => (
    <ContactDetailsField
      contactDetails={translator.contactDetails}
      field={field}
      disabled
    />
  );

  return (
    <>
      <div className="columns margin-top-lg">
        <H3 className="grow">{t('header.personalInformation')}</H3>
        <Button
          data-testid="clerk-translator-details__contact-details__edit-btn"
          variant={Variant.Contained}
          color={Color.Secondary}
        >
          {t('buttons.edit')}
        </Button>
      </div>
      <div className="grid-columns gapped">
        {contactDetailsField('lastName')}
        {contactDetailsField('firstName')}
        {contactDetailsField('identityNumber')}
      </div>
      <H3>{t('header.address')}</H3>
      <div className="grid-columns gapped">
        {contactDetailsField('street')}
        {contactDetailsField('postalCode')}
        {contactDetailsField('town')}
        {contactDetailsField('country')}
      </div>
      <H3>{t('header.contactInformation')}</H3>
      <div className="grid-columns gapped">
        {contactDetailsField('email')}
        {contactDetailsField('phoneNumber')}
      </div>
    </>
  );
};
