import { SelectChangeEvent } from '@mui/material';

export type SelectValue = string | number | readonly string[] | undefined;

export interface DropdownProps {
  id?: string;
  label?: string;
  className?: string;
  dataTestId?: string;
  showInputLabel?: boolean;
  disableUnderline?: boolean;
  helperText?: string;
  showError?: boolean;
  sortByKeys?: boolean;
  variant: 'standard' | 'outlined' | 'filled' | undefined;
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  values: Map<SelectValue, SelectValue>;
}
