import { ChangeEvent, useState } from 'react';

import { CustomSwitch } from 'components/elements/CustomSwitch';
import { CustomTextField } from 'components/elements/CustomTextField';
import { H3 } from 'components/elements/Text';
import {
  translateOutsideComponent,
  useAppTranslation,
  useCommonTranslation,
} from 'configs/i18n';
import { TextFieldTypes } from 'enums/app';
import { ClerkTranslatorTextField } from 'enums/clerkTranslator';
import { ClerkTranslatorBasicInformation } from 'interfaces/clerkTranslator';
import { ClerkTranslatorTextFieldProps } from 'interfaces/clerkTranslatorTextField';
import { Utils } from 'utils';

const getFieldType = (field: ClerkTranslatorTextField) => {
  switch (field) {
    case ClerkTranslatorTextField.PhoneNumber:
      return TextFieldTypes.PhoneNumber;
    case ClerkTranslatorTextField.Email:
      return TextFieldTypes.Email;
    case ClerkTranslatorTextField.ExtraInformation:
      return TextFieldTypes.Textarea;
    case ClerkTranslatorTextField.IdentityNumber:
      return TextFieldTypes.PersonalIdentityCode;
    default:
      return TextFieldTypes.Text;
  }
};

const getFieldError = (
  translator: ClerkTranslatorBasicInformation | undefined,
  field: ClerkTranslatorTextField
) => {
  const t = translateOutsideComponent();
  const type = getFieldType(field);
  const fieldValue = (translator && translator[field]) || '';
  const required =
    field == ClerkTranslatorTextField.FirstName ||
    field == ClerkTranslatorTextField.LastName;
  const error = Utils.inspectCustomTextFieldErrors(type, fieldValue, required);

  return error ? t(`akt.${error}`) : '';
};

const ClerkTranslatorDetailsTextField = ({
  translator,
  field,
  onChange,
  displayError,
  ...rest
}: ClerkTranslatorTextFieldProps) => {
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
      error={displayError && fieldError?.length > 0}
      helperText={displayError ? fieldError : ''}
      {...rest}
    />
  );
};

export const ClerkTranslatorDetailsFields = ({
  translator,
  onFieldChange,
  editDisabled,
  topControlButtons,
  displayFieldErrorBeforeChange,
}: {
  translator?: ClerkTranslatorBasicInformation;
  onFieldChange: (
    field: keyof ClerkTranslatorBasicInformation
  ) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  editDisabled: boolean;
  topControlButtons?: JSX.Element;
  displayFieldErrorBeforeChange: boolean;
}) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.translatorDetails',
  });
  const translateCommon = useCommonTranslation();

  const initialErrors = Object.values(ClerkTranslatorTextField).reduce(
    (acc, val) => {
      return { ...acc, [val]: displayFieldErrorBeforeChange };
    },
    {}
  ) as Record<ClerkTranslatorTextField, boolean>;
  const [displayFieldError, setDisplayFieldError] = useState(initialErrors);
  const displayFieldErrorOnBlur = (field: ClerkTranslatorTextField) => () => {
    setDisplayFieldError({ ...displayFieldError, [field]: true });
  };

  const getCommonTextFieldProps = (field: ClerkTranslatorTextField) => ({
    field,
    translator,
    disabled: editDisabled,
    onChange: onFieldChange(field),
    onBlur: displayFieldErrorOnBlur(field),
    displayError: displayFieldError[field],
  });

  return (
    <>
      <div className="columns margin-top-lg">
        <div className="columns margin-top-lg grow">
          <H3>{t('header.personalInformation')}</H3>
        </div>
        {topControlButtons}
      </div>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.LastName)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.FirstName)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.IdentityNumber)}
        />
      </div>
      <H3>{t('header.address')}</H3>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.Street)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.PostalCode)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.Town)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.Country)}
        />
      </div>
      <H3>{t('header.contactInformation')}</H3>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.Email)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextField.PhoneNumber)}
        />
      </div>
      <H3>{t('header.extraInformation')}</H3>
      <ClerkTranslatorDetailsTextField
        {...getCommonTextFieldProps(ClerkTranslatorTextField.ExtraInformation)}
        multiline
        fullWidth
      />
      <div className="rows gapped-xs">
        <H3>{t('header.isAssuranceGiven')}</H3>
        <CustomSwitch
          disabled={editDisabled}
          onChange={onFieldChange('isAssuranceGiven')}
          value={translator?.isAssuranceGiven}
          leftLabel={translateCommon('no')}
          rightLabel={translateCommon('yes')}
          errorLabel={
            !translator?.isAssuranceGiven && t('caveats.isNotAssuranceGiven')
          }
        />
      </div>
    </>
  );
};
