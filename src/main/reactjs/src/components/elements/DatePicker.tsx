import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { DatePickerProps } from 'interfaces/datePicker';

const MAX_DATE = '2222-02-22';

export const DatePicker = ({
  value,
  setValue,
  label,
}: DatePickerProps): JSX.Element => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <Stack spacing={3}>
      <TextField
        label={label}
        type="date"
        onChange={handleChange}
        value={value}
        sx={{ width: 220 }}
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: new Date().toISOString().split('T')[0],
          max: MAX_DATE,
        }}
      />
    </Stack>
  );
};
