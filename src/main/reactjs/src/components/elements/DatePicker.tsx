import DateAdapter from '@mui/lab/AdapterDayjs';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

const defaultMask = '__.__.____';
const defaultInputFormat = 'DD.MM.YYYY';

export const DatePicker = ({
  value,
  setValue,
  label,
  inputFormat = defaultInputFormat,
  mask = defaultMask,
}: {
  value: Date | null;
  setValue: (date: Date | null) => void;
  label: string;
  mask?: string;
  inputFormat?: string;
}) => {
  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Stack spacing={3}>
        <DesktopDatePicker
          className="oph-date-picker"
          label={label}
          inputFormat={inputFormat}
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
          mask={mask}
        />
      </Stack>
    </LocalizationProvider>
  );
};
