import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { Color } from 'enums/app';

export const ClerkNavTabs = () => {
  const [value, setValue] = useState('register');
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk.navLinks',
  });
  const translateCommon = useCommonTranslation();

  const handleChange = ({}, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      textColor={Color.Secondary}
      indicatorColor={Color.Secondary}
      aria-label={t('tabsLabel')}
    >
      <Tab value="register" label={translateCommon('register')} />
      <Tab value="meetingDates" label={t('meetingDates')} />
    </Tabs>
  );
};
