import { AutocompleteProps } from '@mui/material';

export type ComboBoxOption = { label: string; value: string };
export type AutocompleteValue = ComboBoxOption | null;
export interface ComboBoxProps {
  label?: string;
  showInputLabel?: boolean;
  helperText?: string;
  showError?: boolean;
  variant: string;
  getOptionLabel?: (option: AutocompleteValue) => string;
  values: Array<ComboBoxOption>;
  value: AutocompleteValue;
}

export type AutoCompleteComboBox = Omit<
  AutocompleteProps<AutocompleteValue, false, false, false>,
  'options' | 'renderInput'
>;
