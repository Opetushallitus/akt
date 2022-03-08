import { ChangeEvent } from 'react';

import {
  ClerkTranslator,
  ClerkTranslatorTextField,
} from 'interfaces/clerkTranslator';
import { CustomTextFieldProps } from 'interfaces/customTextField';

export type ClerkTranslatorTextFieldProps = {
  translator?: ClerkTranslator;
  field: keyof ClerkTranslatorTextField;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
} & CustomTextFieldProps;
