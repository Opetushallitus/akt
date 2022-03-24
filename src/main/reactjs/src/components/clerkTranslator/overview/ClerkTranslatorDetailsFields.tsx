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
import { ClerkTranslatorTextFieldType } from 'enums/clerkTranslator';
import { ClerkTranslatorBasicInformation } from 'interfaces/clerkTranslator';
import { ClerkTranslatorTextFieldProps } from 'interfaces/clerkTranslatorTextField';
import { Utils } from 'utils';

const getTextFieldType = (fieldType: ClerkTranslatorTextFieldType) => {
  switch (fieldType) {
    case ClerkTranslatorTextFieldType.PhoneNumber:
      return TextFieldTypes.PhoneNumber;
    case ClerkTranslatorTextFieldType.Email:
      return TextFieldTypes.Email;
    case ClerkTranslatorTextFieldType.ExtraInformation:
      return TextFieldTypes.Textarea;
    case ClerkTranslatorTextFieldType.IdentityNumber:
      return TextFieldTypes.PersonalIdentityCode;
    default:
      return TextFieldTypes.Text;
  }
};

const getFieldError = (
  translator: ClerkTranslatorBasicInformation | undefined,
  fieldType: ClerkTranslatorTextFieldType
) => {
  const t = translateOutsideComponent();
  const textFieldType = getTextFieldType(fieldType);
  const fieldValue = (translator && translator[fieldType]) || '';
  const required =
    fieldType == ClerkTranslatorTextFieldType.FirstName ||
    fieldType == ClerkTranslatorTextFieldType.LastName;

  const error = Utils.inspectCustomTextFieldErrors(
    textFieldType,
    fieldValue,
    required
  );

  return error ? t(`akt.${error}`) : '';
};

const ClerkTranslatorDetailsTextField = ({
  translator,
  fieldType,
  onChange,
  displayError,
  ...rest
}: ClerkTranslatorTextFieldProps) => {
  // I18n
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.clerkTranslatorOverview.translatorDetails.fields',
  });
  const fieldError = getFieldError(translator, fieldType);

  return (
    <CustomTextField
      value={translator ? translator[fieldType] : undefined}
      label={t(fieldType)}
      data-testid={`clerk-translator-overview__translator-details__field-${fieldType}`}
      onChange={onChange}
      type={getTextFieldType(fieldType)}
      error={displayError && fieldError?.length > 0}
      helperText={fieldError}
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

  const initialErrors = Object.values(ClerkTranslatorTextFieldType).reduce(
    (acc, val) => {
      return { ...acc, [val]: displayFieldErrorBeforeChange };
    },
    {}
  ) as Record<ClerkTranslatorTextFieldType, boolean>;

  const [displayFieldError, setDisplayFieldError] = useState(initialErrors);
  const onFieldBlur = (fieldType: ClerkTranslatorTextFieldType) => () => {
    if (translator && fieldType) {
      translator[fieldType] = (translator[fieldType] as string).trim();
    }
    setDisplayFieldError({ ...displayFieldError, [fieldType]: true });
  };

  const getCommonTextFieldProps = (
    fieldType: ClerkTranslatorTextFieldType
  ) => ({
    fieldType,
    translator,
    disabled: editDisabled,
    onChange: onFieldChange(fieldType),
    onBlur: onFieldBlur(fieldType),
    displayError: displayFieldError[fieldType],
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
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.LastName)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.FirstName)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(
            ClerkTranslatorTextFieldType.IdentityNumber
          )}
        />
      </div>
      <H3>{t('header.address')}</H3>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.Street)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.PostalCode)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.Town)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.Country)}
        />
      </div>
      <H3>{t('header.contactInformation')}</H3>
      <div className="grid-columns gapped">
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.Email)}
        />
        <ClerkTranslatorDetailsTextField
          {...getCommonTextFieldProps(ClerkTranslatorTextFieldType.PhoneNumber)}
        />
      </div>
      <H3>{t('header.extraInformation')}</H3>
      <ClerkTranslatorDetailsTextField
        {...getCommonTextFieldProps(
          ClerkTranslatorTextFieldType.ExtraInformation
        )}
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
