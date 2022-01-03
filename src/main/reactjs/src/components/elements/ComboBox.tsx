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
    langCode: string | undefined,
    valuesArray: [string, string][]
  ): [string, string][] => {
    if (langCode) {
      if (!primaryOptions?.includes(langCode)) {
        return valuesArray.filter((v) => primaryOptions?.includes(v[1]));
      }
    }

    return valuesArray;
  };

  const valuesArray = Array.from(values);
  // Filter out the value selected in another combobox
  const filteredValuesArray = valuesArray.filter(
    (value) => value[1] !== filterValue
  );
  // Filter out all other values if values from primaryOptions are not selected in another combobox
  const filteredValuesArray2 = filterSelectedLang(
    filterValue,
    filteredValuesArray
  );

  const initialValuesToShow = sortByKeys
    ? filteredValuesArray2.sort()
    : filteredValuesArray2;
  const primaryLangOptions = primaryOptions ?? [];
  // Sort option value pairs into order set in primaryOptions parameter
  const primaryValues = initialValuesToShow
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
    ...initialValuesToShow.filter((value) => !primaryValues.includes(value)),
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
