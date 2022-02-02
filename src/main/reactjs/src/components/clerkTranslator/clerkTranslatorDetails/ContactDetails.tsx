import { Button } from '@mui/material';

import { CustomTextField } from 'components/elements/CustomTextField';
import { H2 } from 'components/elements/Text';
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
      <div className="columns">
        <H2 className="grow">{t('header.personalInformation')}</H2>
        <Button variant={Variant.Contained} color={Color.Secondary}>
          {t('buttons.edit')}
        </Button>
      </div>
      <div className="columns gapped">
        {contactDetailsField('lastName')}
        {contactDetailsField('firstName')}
        {contactDetailsField('identityNumber')}
      </div>
      <H2>{t('header.address')}</H2>
      <div className="columns gapped">
        {contactDetailsField('street')}
        {contactDetailsField('postalCode')}
        {contactDetailsField('town')}
        {contactDetailsField('country')}
      </div>
      <H2>{t('header.contactInformation')}</H2>
      <div className="columns gapped">
        {contactDetailsField('email')}
        {contactDetailsField('phoneNumber')}
      </div>
    </>
  );
};
