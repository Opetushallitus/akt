type SelectValue = string | number | readonly string[] | undefined;

export interface CustomSelectProps {
  showInputLabel?: boolean;
  values: Map<SelectValue, SelectValue>;
  helperText?: string;
  disableUnderline?: boolean;
  sortByKeys?: boolean;
  showError?: boolean;
}
