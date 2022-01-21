import {
  FormControl,
  FormHelperText,
  Autocomplete,
  TextField,
} from '@mui/material';

import {
  ComboBoxOption,
  ComboBoxProps,
  AutocompleteValue,
  AutoCompleteComboBox,
} from 'interfaces/combobox';

const compareOptionLabels = (a: ComboBoxOption, b: ComboBoxOption) => {
  return a.label <= b.label ? -1 : 1;
};

export const sortOptionsByLabels = (values: Array<ComboBoxOption>) => {
  return values.sort(compareOptionLabels);
};

const getOptionLabel = (option: AutocompleteValue): string => {
  return option?.label || '';
};

const isOptionEqualToValue = (
  option: AutocompleteValue,
  value: AutocompleteValue
) => {
  if (option === null && value === null) {
    return true;
  } else if (option === null || value === null) {
    return false;
  } else {
    return option.value === value.value;
  }
};

export const valueAsOption = (value: string) => ({
  value: value,
  label: value,
});

export const ComboBox = ({
  label,
  values,
  variant,
  helperText,
  showError,
  ...rest
}: ComboBoxProps & AutoCompleteComboBox) => {
  return (
    <FormControl fullWidth error={showError}>
      <Autocomplete
        disablePortal
        {...rest}
        getOptionLabel={getOptionLabel}
        isOptionEqualToValue={isOptionEqualToValue}
        options={values}
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
