import {
  FormControl,
  FormHelperText,
  Autocomplete,
  AutocompleteProps,
  TextField,
} from '@mui/material';

import {
  ComboBoxOption,
  ComboBoxProps,
  AutocompleteValue,
} from 'interfaces/combobox';

type AutoCompleteComboBox = Omit<
  AutocompleteProps<AutocompleteValue, false, false, false>,
  'options' | 'renderInput' | 'value' | 'getOptionLabel'
>;

export const ComboBox = ({
  id,
  filterValue,
  primaryOptions,
  label,
  values,
  value,
  variant,
  dataTestId,
  helperText,
  showError,
  sortByKeys,
  getOptionLabel,
  onInputChange,
  inputValue,
  ...rest
}: ComboBoxProps & AutoCompleteComboBox) => {
  const AutocompleteProps = {
    ...(getOptionLabel && { getOptionLabel }),
    ...(label && { label }),
    ...(dataTestId && { 'data-testid': dataTestId }),
    ...rest,
  };

  const filterSelectedLang = (
    filterValue: string | undefined,
    valuesArray: Array<ComboBoxOption>,
    primaryLangOptions: string[]
  ): Array<ComboBoxOption> => {
    const valuesArrayWithoutSelectedLang = valuesArray.filter(
      (val) => val[1] !== filterValue
    );
    if (filterValue) {
      if (!primaryLangOptions.includes(filterValue)) {
        return valuesArrayWithoutSelectedLang.filter((val) =>
          primaryLangOptions.includes(val[1])
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
    .filter((val) => {
      return primaryLangOptions.indexOf(val[1]) >= 0;
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

  return (
    <FormControl fullWidth error={showError}>
      <Autocomplete
        disablePortal
        id={id}
        {...AutocompleteProps}
        onInputChange={onInputChange}
        inputValue={inputValue}
        value={value}
        options={valuesToShow}
        isOptionEqualToValue={(
          option: AutocompleteValue,
          value: AutocompleteValue
        ) => {
          if (option === null && value === null) {
            return true;
          } else if (option === null || value === null) {
            return false;
          } else {
            return option[1] === value[1];
          }
        }}
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
