import { AutocompleteProps } from '@mui/material';

export type ComboBoxOption = { label: string; value: string };
export type AutocompleteValue = ComboBoxOption | null;
export type textFieldVariant = 'standard' | 'outlined' | 'filled' | undefined;
export interface ComboBoxProps {
  label?: string;
  showInputLabel?: boolean;
  helperText?: string;
  showError?: boolean;
  variant: textFieldVariant;
  getOptionLabel?: (option: AutocompleteValue) => string;
  values: Array<ComboBoxOption>;
  value: AutocompleteValue;
}

export type AutoCompleteComboBox = Omit<
  AutocompleteProps<AutocompleteValue, false, false, false>,
  'options' | 'renderInput'
>;
