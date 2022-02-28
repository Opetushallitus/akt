import { TextField } from '@mui/material';

export interface CustomTextFieldProps {
  showHelperText?: boolean;
}

export const CustomTextField = ({
  error,
  helperText,
  showHelperText,
  multiline,
  ...rest
}: CustomTextFieldProps) => {
  const minRows = multiline ? 5 : undefined;
  const maxRows = multiline ? 15 : undefined;

  return (
    <TextField
      minRows={minRows}
      maxRows={maxRows}
      error={error}
      multiline={multiline}
      helperText={(error || showHelperText) && helperText}
      {...rest}
    />
  );
};
