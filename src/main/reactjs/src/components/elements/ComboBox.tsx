import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
} from '@mui/material';

import { ComboBoxProps } from 'interfaces/combobox';

export const ComboBox = ({
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
    ...(label && { label }),
    ...(dataTestId && { 'data-testid': dataTestId }),
    ...(disableClearable && { disableClearable }),
  };

  const filterSelectedLang = (
    filterValue: string | undefined,
    valuesArray: [string, string][],
    primaryLangOptions: string[]
  ): [string, string][] => {
    const valuesArrayWithoutSelectedLang = valuesArray.filter(
      (value) => value[1] !== filterValue
    );
    if (filterValue) {
      if (!primaryLangOptions.includes(filterValue)) {
        return valuesArrayWithoutSelectedLang.filter((value) =>
          primaryLangOptions.includes(value[1])
        );
      }
    }

    return valuesArrayWithoutSelectedLang;
  };
  const primaryLangOptions = primaryOptions ?? [];
  const valuesArray = Array.from(values);

  const filteredValuesArray = filterSelectedLang(
    filterValue,
    valuesArray,
    primaryLangOptions
  );

  const optionValuesToShow = sortByKeys
    ? filteredValuesArray.sort()
    : filteredValuesArray;
  // Sort option value pairs into order set in primaryOptions parameter
  const primaryValues = optionValuesToShow
    .filter((value) => {
      return primaryLangOptions.indexOf(value[1]) >= 0;
    })
    .sort((a, b) => {
      return (
        primaryLangOptions.indexOf(a[1]) - primaryLangOptions.indexOf(b[1])
      );
    });

  // Merge sorted primaryOptions and sorted values
  const valuesToShow = [
    ...primaryValues,
    ...optionValuesToShow.filter((value) => !primaryValues.includes(value)),
  ];

  // Find string value param in the filtered and sorted options array
  const foundValue = valuesToShow.find((item) => item[1] === value);

  return (
    <FormControl fullWidth error={showError}>
      <Autocomplete
        disablePortal
        id={id}
        value={value === '' ? null : foundValue}
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
