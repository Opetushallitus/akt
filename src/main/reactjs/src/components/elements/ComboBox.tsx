import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
} from '@mui/material';

import { ComboBoxProps } from 'interfaces/combobox';

export const ComboBox = ({
  className,
  id,
  value,
  filterValue,
  primaryOptions,
  label,
  onChange,
  values,
  variant,
  dataTestId,
  helperText,
  showError,
  sortByKeys,
  disableClearable,
  getOptionLabel,
}: ComboBoxProps) => {
  const AutocompleteProps = {
    onChange,
    ...(getOptionLabel && { getOptionLabel }),
    value,
    ...(className && { className }),
    ...(label && { label }),
    ...(dataTestId && { 'data-testid': dataTestId }),
    ...(disableClearable && { disableClearable }),
  };
  const valuesArray = Array.from(values);
  const filteredValueArray = valuesArray.filter(
    (v) => v[1] !== filterValue?.[1]
  );
  const initialValuesToShow = sortByKeys
    ? filteredValueArray.sort()
    : filteredValueArray;
  const primaryLangOptions = primaryOptions ?? [];
  const primaryValues = initialValuesToShow
    .filter((value) => {
      return primaryLangOptions.indexOf(value[1] as string) >= 0;
    })
    .sort((a, b) => {
      return (
        primaryLangOptions.indexOf(a[1] as string) -
        primaryLangOptions.indexOf(b[1] as string)
      );
    });
  const valuesToShow = [
    ...primaryValues,
    ...initialValuesToShow.filter((value) => !primaryValues.includes(value)),
  ];
  return (
    <FormControl fullWidth error={showError}>
      <Autocomplete
        disablePortal
        id={id}
        options={valuesToShow}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant={variant}
            error={showError}
          />
        )}
        {...AutocompleteProps}
      />
      {showError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
