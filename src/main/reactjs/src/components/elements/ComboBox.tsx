import {
  FormControl,
  FormHelperText,
  Autocomplete,
  AutocompleteProps,
  TextField,
} from '@mui/material';

import { ComboBoxOption, ComboBoxProps } from 'interfaces/combobox';

type AutoCompleteComboBox = Omit<
  AutocompleteProps<ComboBoxOption, false, true, false>,
  'options' | 'renderInput'
>;

export const ComboBox = ({
  id,
  val,
  filterValue,
  primaryOptions,
  label,
  values,
  variant,
  dataTestId,
  helperText,
  showError,
  sortByKeys,
  disableClearable,
  getOptionLabel,
  ...rest
}: ComboBoxProps & AutoCompleteComboBox) => {
  const AutocompleteProps = {
    ...(getOptionLabel && { getOptionLabel }),
    ...(label && { label }),
    ...(dataTestId && { 'data-testid': dataTestId }),
    ...(disableClearable && { disableClearable }),
    ...rest,
  };

  const filterSelectedLang = (
    filterValue: string | undefined,
    valuesArray: Array<ComboBoxOption>,
    primaryLangOptions: string[]
  ): Array<ComboBoxOption> => {
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
  const foundValue = valuesToShow.find((item) => item[1] === val);

  return (
    <FormControl fullWidth error={showError}>
      <Autocomplete
        disablePortal
        id={id}
        value={val === '' ? undefined : foundValue}
        {...AutocompleteProps}
        options={valuesToShow}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            variant={variant}
            error={showError}
          />
        )}
      />
      {showError && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};
