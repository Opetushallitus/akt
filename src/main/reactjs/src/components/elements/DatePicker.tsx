import DateAdapter from '@mui/lab/AdapterDayjs';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import * as React from 'react';

import { useAppTranslation } from 'configs/i18n';
import { DateUtils } from 'utils/date';

export const DatePicker = () => {
  const [value, setValue] = React.useState<Date | null>(
    DateUtils.dateAtStartOfDay(new Date())
  );
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.addMeetingDate',
  });

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <Stack spacing={3}>
        <DesktopDatePicker
          label={t('datePickerLabel')}
          inputFormat="DD.MM.YYYY"
          value={value}
          onChange={handleChange}
          renderInput={(params) => <TextField {...params} />}
        />
      </Stack>
    </LocalizationProvider>
  );
};
