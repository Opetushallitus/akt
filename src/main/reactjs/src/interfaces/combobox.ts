export type ComboBoxOption = [string, string];
export type AutocompleteValue = ComboBoxOption | null;
export interface ComboBoxProps {
  id?: string;
  label?: string;
  dataTestId?: string;
  showInputLabel?: boolean;
  disableUnderline?: boolean;
  helperText?: string;
  showError?: boolean;
  sortByKeys?: boolean;
  filterValue?: string;
  primaryOptions?: Array<string>;
  variant: 'standard' | 'outlined' | 'filled' | undefined;
  getOptionLabel?: (option: AutocompleteValue) => string;
  values: Map<string, string>;
  value: AutocompleteValue;
}
