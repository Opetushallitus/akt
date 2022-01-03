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
      } else {
        return valuesArray;
      }
    } else {
      return valuesArray;
    }
  };

  const valuesArray = Array.from(values);
  const filteredValueArray = valuesArray.filter((v) => v[1] !== filterValue);
  const filteredValuesArray2 = filterSelectedLang(
    filterValue,
    filteredValueArray
  );
  const initialValuesToShow = sortByKeys
    ? filteredValuesArray2.sort()
    : filteredValuesArray2;
  const primaryLangOptions = primaryOptions ?? [];
  const primaryValues = initialValuesToShow
    .filter((value) => {
      return primaryLangOptions.indexOf(value[1]) >= 0;
    })
    .sort((a, b) => {
      return (
        primaryLangOptions.indexOf(a[1]) - primaryLangOptions.indexOf(b[1])
      );
    });

  const valuesToShow = [
    ...primaryValues,
    ...initialValuesToShow.filter((value) => !primaryValues.includes(value)),
  ];

  const foundValue = valuesToShow.find((item) => item[1] === value);

  return (
    <FormControl fullWidth error={showError}>
      <Autocomplete
        disablePortal
        id={id}
        value={foundValue}
        //value={value === '' ? null : foundValue}
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
