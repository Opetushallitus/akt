export type ComboBoxValue = string | number | readonly string[] | undefined;
export interface ComboBoxProps {
  id?: string;
  label?: string;
  className?: string;
  dataTestId?: string;
  showInputLabel?: boolean;
  disableUnderline?: boolean;
  helperText?: string;
  showError?: boolean;
  sortByKeys?: boolean;
  disableClearable?: boolean;
  filterValue?: string;
  primaryOptions?: Array<string>;
  value: string | null;
  variant: 'standard' | 'outlined' | 'filled' | undefined;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string,
    reason: string,
    details?: string
  ) => void;
  getOptionLabel?: (option: [ComboBoxValue, ComboBoxValue]) => string;
  values: Map<ComboBoxValue, ComboBoxValue>;
}
