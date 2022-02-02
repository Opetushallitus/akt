import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from '@mui/material';

import { CustomSelectProps } from 'interfaces/customSelect';

export const CustomSelect = ({
  showInputLabel,
  id,
  label,
  values,
  helperText,
  showError,
  sortByKeys,
  ...selectOnlyProps
}: CustomSelectProps & SelectProps<string>) => {
  const valuesArray = Array.from(values);
  const valuesToShow = sortByKeys ? valuesArray.sort() : valuesArray;

  const selectProps = { id, label, ...selectOnlyProps };

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
