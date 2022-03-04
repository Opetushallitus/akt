import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

export interface DatePickerProps {
  value: string;
  setValue: (value: string) => void;
  label: string;
  minDate: Date;
  maxDate: Date;
}

export const DatePicker = ({
  value,
  setValue,
  label,
  minDate,
  maxDate,
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
          min: minDate.toISOString().split('T')[0],
          max: maxDate.toISOString().split('T')[0],
        }}
      />
    </Stack>
  );
};
