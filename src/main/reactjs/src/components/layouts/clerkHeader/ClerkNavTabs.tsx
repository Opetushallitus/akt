import { Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { Color, HeaderTabNav } from 'enums/app';

export const ClerkNavTabs = (): JSX.Element => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk.navLinks',
  });
  const translateCommon = useCommonTranslation();

  const [value, setValue] = useState('register');

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
      <Tab
        data-testid={'clerk-nav-tab__register'}
        value={HeaderTabNav.Register}
        label={translateCommon(HeaderTabNav.Register)}
      />
      <Tab
        data-testid={'clerk-nav-tab__meeting-dates'}
        value={HeaderTabNav.MeetingDates}
        label={translateCommon(HeaderTabNav.MeetingDates)}
      />
    </Tabs>
  );
};
