import { ChangeEvent } from 'react';

import { ClerkTranslatorTextFieldType } from 'enums/clerkTranslator';
import { ClerkTranslatorBasicInformation } from 'interfaces/clerkTranslator';
import { CustomTextFieldProps } from 'interfaces/components/customTextField';

export type ClerkTranslatorTextFieldProps = {
  translator?: ClerkTranslatorBasicInformation;
  fieldType: ClerkTranslatorTextFieldType;
  displayError: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & CustomTextFieldProps;

export interface ClerkTranslatorTextField {
  firstName: string;
  lastName: string;
  identityNumber?: string;
  email?: string;
  phoneNumber?: string;
  street?: string;
  postalCode?: string;
  town?: string;
  country?: string;
  extraInformation?: string;
}
