export type ComboBoxOption = [string, string];

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
  getOptionLabel?: (option: ComboBoxOption) => string;
  values: Map<string, string>;
  val: string;
}
