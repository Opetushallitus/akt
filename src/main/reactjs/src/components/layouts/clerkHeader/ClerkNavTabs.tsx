import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';

import { useAppTranslation } from 'configs/i18n';
import { Color } from 'enums/app';

export const ClerkNavTabs = () => {
  const [value, setValue] = useState('register');
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk.navLinks',
  });

  const handleChange = ({}, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor={Color.Secondary}
      indicatorColor={Color.Secondary}
      aria-label="secondary tabs urls"
    >
      <Tab value="register" label={t('register')} />
      <Tab value="documentCreation" label={t('documentCreation')} />
      <Tab value="meetingDates" label={t('meetingDates')} />
    </Tabs>
  );
};
