import { TextField, TextFieldProps } from '@mui/material';

import { CustomTextFieldProps } from 'interfaces/customTextField';

export const CustomTextField = ({
  error,
  helperText,
  showHelperText,
  ...rest
}: CustomTextFieldProps & TextFieldProps) => {
  const minRows = rest.multiline ? 5 : undefined;
  const maxRows = rest.multiline ? 15 : undefined;

  return (
    <TextField
      minRows={minRows}
      maxRows={maxRows}
      error={error}
      helperText={(error || showHelperText) && helperText}
      {...rest}
    />
  );
};
