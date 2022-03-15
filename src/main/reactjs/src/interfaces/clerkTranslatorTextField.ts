import { ChangeEvent } from 'react';

import { ClerkTranslatorBasicInformation } from 'interfaces/clerkTranslator';
import { CustomTextFieldProps } from 'interfaces/components/customTextField';

export type ClerkTranslatorTextField = Omit<
  ClerkTranslatorBasicInformation,
  'isAssuranceGiven'
>;

export type ClerkTranslatorTextFieldProps = {
  translator?: ClerkTranslatorBasicInformation;
  field: keyof ClerkTranslatorTextField;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & CustomTextFieldProps;
