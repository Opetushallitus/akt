export type ComboBoxOption = [string, string];
export type AutocompleteValue = ComboBoxOption | null;
export type textFieldVariant = 'standard' | 'outlined' | 'filled' | undefined;
export interface PublicTranslatorComboBoxDetails {
  toLang: string;
  fromLang: string;
  town: string;
}
export interface ComboBoxProps {
  label?: string;
  dataTestId?: string;
  showInputLabel?: boolean;
  helperText?: string;
  showError?: boolean;
  sortByKeys?: boolean;
  filterValue?: string;
  primaryOptions?: Array<string>;
  variant: textFieldVariant;
  getOptionLabel?: (option: AutocompleteValue) => string;
  values: Map<string, string>;
  value: AutocompleteValue;
}
