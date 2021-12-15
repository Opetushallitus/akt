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
  sortByKeys,
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
  const valuesArray = Array.from(values);
  const valuesToShow = sortByKeys ? valuesArray.sort() : valuesArray;

  return (
    <FormControl fullWidth error={showError}>
      {showInputLabel && <InputLabel id={id}>{label}</InputLabel>}
      <Select autoWidth {...selectProps}>
        {valuesToShow.map(([key, value], index) => (
          <MenuItem key={index} value={value}>
            {key}
          </MenuItem>
        ))}
      </Select>
      {showError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
