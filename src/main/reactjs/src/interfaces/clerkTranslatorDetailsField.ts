import { ChangeEvent } from 'react';

import {
  ClerkTranslator,
  ClerkTranslatorBasicInformation,
} from 'interfaces/clerkTranslator';
import { CustomTextFieldProps } from 'interfaces/customTextField';

export type ClerkTranslatorDetailsFieldProps = {
  translator?: ClerkTranslator;
  field: keyof ClerkTranslatorBasicInformation;
  onFieldChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
} & CustomTextFieldProps;
