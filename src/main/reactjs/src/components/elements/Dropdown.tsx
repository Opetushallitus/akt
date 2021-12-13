import {
  FormControl,
  Select,
  InputLabel,
  MenuItem,
  FormHelperText,
} from '@mui/material';

import { DropdownProps } from 'interfaces/dropdown';

export const Dropdown = ({
  className,
  showInputLabel,
  id,
  value,
  label,
  onChange,
  values,
  variant,
  dataTestId,
  disableUnderline,
  helperText,
  showError,
}: DropdownProps) => {
  const selectProps = {
    value,
    onChange,
    variant,
    ...(disableUnderline && { disableUnderline }),
    ...(className && { className }),
    ...(label && { label }),
    ...(id && { labelId: id }),
    ...(dataTestId && { 'data-testid': dataTestId }),
  };

  return (
    <FormControl fullWidth error={showError}>
      {showInputLabel && <InputLabel id={id}>{label}</InputLabel>}
      <Select autoWidth {...selectProps}>
        {Array.from(values).map(([key, value], index) => (
          <MenuItem key={index} value={value}>
            {key}
          </MenuItem>
        ))}
      </Select>
      {showError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
