import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { Dayjs } from 'dayjs';

import { DateUtils } from 'utils/date';

export interface DatePickerProps {
  value?: string;
  setValue: (value: string) => void;
  label: string;
  minDate?: Dayjs;
  maxDate?: Dayjs;
}

export const DatePicker = ({
  value,
  setValue,
  label,
  minDate,
  maxDate,
}: DatePickerProps): JSX.Element => {
  const MIN_DATE = '1900-01-01';
  const MAX_DATE = '2100-01-01';
  const dayjs = DateUtils.dayjs();

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
        InputLabelProps={{
          shrink: true,
        }}
        inputProps={{
          min: DateUtils.formatOptionalDate(minDate ?? dayjs(MIN_DATE)),
          max: DateUtils.formatOptionalDate(maxDate ?? dayjs(MAX_DATE)),
        }}
      />
    </Stack>
  );
};
