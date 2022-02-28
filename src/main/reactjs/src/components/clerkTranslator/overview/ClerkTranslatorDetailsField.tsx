import { CustomTextField } from 'components/elements/CustomTextField';
import { useAppTranslation } from 'configs/i18n';
import { TextFieldTypes } from 'enums/app';
import {
  ClerkTranslator,
  ClerkTranslatorBasicInformation,
} from 'interfaces/clerkTranslator';
import { ClerkTranslatorDetailsFieldProps } from 'interfaces/clerkTranslatorDetailsField';
import { Utils } from 'utils';

const getFieldType = (field: keyof ClerkTranslatorBasicInformation) => {
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
  field: keyof ClerkTranslatorBasicInformation
) => {
  const type = getFieldType(field);
  const fieldValue = (translator && translator[field]) || '';

  return Utils.inspectCustomTextFieldErrors(type, fieldValue, false) || '';
};

export const ClerkTranslatorDetailsField = ({
  translator,
  field,
  onFieldChange,
  ...rest
}: ClerkTranslatorDetailsFieldProps) => {
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
      onChange={onFieldChange}
      type={getFieldType(field)}
      error={fieldError?.length > 0}
      {...rest}
    />
  );
};
