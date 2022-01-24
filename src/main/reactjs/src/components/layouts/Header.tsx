import { FC } from 'react';
import { AppBar, Toolbar, IconButton } from '@mui/material';

import { Svg } from 'components/elements/Svg';
import { LangSelector } from 'components/i18n/LangSelector';
import { ClerkNavTabs } from 'components/layouts//clerkHeader/ClerkNavTabs';
import { ClerkHeaderButtons } from 'components/layouts/clerkHeader/ClerkHeaderButtons';
import Logo from 'public/assets/svg/logo.svg';
import { useAppTranslation } from 'configs/i18n';
import { useAppSelector } from 'configs/redux';
import { selectClerkMeAuthStatus } from 'redux/selectors/clerkMe';

const Header: FC = () => {
  const { t } = useAppTranslation({ keyPrefix: 'akt.component.header' });
  const isClerkUI = useAppSelector(selectClerkMeAuthStatus);

  return (
    <AppBar className="header" position="static">
      <Toolbar className="header__toolbar">
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
        ></IconButton>
        <div className="header__left">
          <Svg className="header__left__logo" src={Logo} alt={t('logo.alt')} />
        </div>
        <div className="header__center">{isClerkUI && <ClerkNavTabs />}</div>
        <div className="header__right">
          {isClerkUI && <ClerkHeaderButtons />}
          <LangSelector />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
