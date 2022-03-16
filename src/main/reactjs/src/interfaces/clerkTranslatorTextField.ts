import { ChangeEvent } from 'react';

import { ClerkTranslatorTextField } from 'enums/clerkTranslator';
import { ClerkTranslatorBasicInformation } from 'interfaces/clerkTranslator';
import { CustomTextFieldProps } from 'interfaces/components/customTextField';

export type ClerkTranslatorTextFieldProps = {
  translator?: ClerkTranslatorBasicInformation;
  field: ClerkTranslatorTextField;
  displayError: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & CustomTextFieldProps;
