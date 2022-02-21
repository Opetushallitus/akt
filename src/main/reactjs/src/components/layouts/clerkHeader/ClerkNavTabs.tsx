import { Tab, Tabs } from '@mui/material';

import { useAppTranslation, useCommonTranslation } from 'configs/i18n';
import { Color, HeaderNav } from 'enums/app';

type ClerkNavTabsProps = {
  headerNav: HeaderNav;
  setHeaderNav: React.Dispatch<React.SetStateAction<HeaderNav>>;
};

export const ClerkNavTabs = ({
  headerNav,
  setHeaderNav,
}: ClerkNavTabsProps): JSX.Element => {
  const { t } = useAppTranslation({
    keyPrefix: 'akt.component.header.clerk.navLinks',
  });
  const translateCommon = useCommonTranslation();

  const handleChange = ({}, newValue: HeaderNav) => {
    setHeaderNav(newValue);
  };

  return (
    <Tabs
      value={headerNav}
      onChange={handleChange}
      textColor={Color.Secondary}
      indicatorColor={Color.Secondary}
      aria-label={t('tabsLabel')}
    >
      <Tab
        value={HeaderNav.Register}
        label={translateCommon(HeaderNav.Register)}
      />
      <Tab value={HeaderNav.MeetingDates} label={t(HeaderNav.MeetingDates)} />
    </Tabs>
  );
};
