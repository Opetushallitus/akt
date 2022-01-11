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
  'options' | 'renderInput'
>;

export const ComboBox = ({
  filterValue,
  primaryOptions,
  label,
  values,
  variant,
  dataTestId,
  helperText,
  showError,
  sortByKeys,
  ...rest
}: ComboBoxProps & AutoCompleteComboBox) => {
  const AutocompleteProps = {
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
