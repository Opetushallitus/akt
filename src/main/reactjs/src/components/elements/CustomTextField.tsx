import { TextField, TextFieldProps } from '@mui/material';

import { CustomTextFieldProps } from 'interfaces/customTextField';

export const CustomTextField = ({
  error,
  helperText,
  showHelperText,
  ...rest
}: CustomTextFieldProps & TextFieldProps) => {
  return (
    <TextField
      error={error}
      helperText={(error || showHelperText) && helperText}
      {...rest}
    />
  );
};
