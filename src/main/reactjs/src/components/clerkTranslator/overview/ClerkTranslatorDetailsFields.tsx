import { ChangeEvent } from 'react';

import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import { useAppTranslation } from 'configs/i18n';
import { TextFieldTypes } from 'enums/app';
import {
  ClerkTranslator,
  ClerkTranslatorBasicInformation,
} from 'interfaces/clerkTranslator';
import {
  ClerkTranslatorTextField,
  ClerkTranslatorTextFieldProps,
} from 'interfaces/clerkTranslatorTextField';
import { Utils } from 'utils';

const ClerkTranslatorDetailsTextField = ({
  translator,
  field,
  onChange,
  ...rest
}: ClerkTranslatorTextFieldProps) => {
  const getFieldType = (field: keyof ClerkTranslatorTextField) => {
    switch (field) {
      case 'phoneNumber':
        return TextFieldTypes.PhoneNumber;
      case 'email':
        return TextFieldTypes.Email;
      case 'extraInformation':
        return TextFieldTypes.Textarea;
      default:
        return TextFieldTypes.Text;
    }
  };

  const getFieldError = (
    translator: ClerkTranslator | undefined,
    field: keyof ClerkTranslatorTextField
  ) => {
    const type = getFieldType(field);
    const fieldValue = (translator && translator[field]) || '';

    return Utils.inspectCustomTextFieldErrors(type, fieldValue, false) || '';
  };

  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.translatorDetails.fields',
  });
  const fieldError = getFieldError(translator, field);

  return (
    <CustomTextField
      value={translator ? translator[field] : undefined}
      label={t(field)}
      data-testid={`clerk-translator-overview__translator-details__field-${field}`}
      onChange={onChange}
      type={getFieldType(field)}
      error={fieldError?.length > 0}
      {...rest}
    />
  );
};

export const ClerkTranslatorDetailsFields = ({
  translator,
  onFieldChange,
  editDisabled,
  controlButtons,
}: {
  translator?: ClerkTranslator;
  onFieldChange: (
    field: keyof ClerkTranslatorBasicInformation
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editDisabled: boolean;
  controlButtons?: JSX.Element;
}) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.translatorDetails',
  });

  const getCommonTextFieldProps = (field: keyof ClerkTranslatorTextField) => ({
    field,
    translator,
    disabled: editDisabled,
    onChange: onFieldChange(field),
  });

  return (
    <>
      <div className="columns margin-top-lg">
        <div className="columns margin-top-lg grow">
          <H3>{t('header.personalInformation')}</H3>
        </div>
        {controlButtons}
      </div>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('lastName')}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('firstName')}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('identityNumber')}
        />
      </div>
      <H3>{t('header.address')}</H3>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('street')}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('postalCode')}
        />
        <ClerkTranslatorDetailsTextField {...getCommonTextFieldProps('town')} />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('country')}
        />
      </div>
      <H3>{t('header.contactInformation')}</H3>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('email')}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps('phoneNumber')}
        />
      </div>
      <H3>{t('header.extraInformation')}</H3>
      <ClerkTranslatorDetailsTextField
        {...getCommonTextFieldProps('extraInformation')}
        multiline
        fullWidth
      />
    </>
  );
};
