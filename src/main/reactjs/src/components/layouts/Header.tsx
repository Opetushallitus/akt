import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, IconButton } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { Svg } from 'components/elements/Svg';
import { ExtLink } from 'components/elements/ExtLink';
import { LangSelector } from 'components/i18n/LangSelector';
import Logo from 'public/assets/svg/logo.svg';

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <AppBar className="header" position="static">
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
        ></IconButton>
        <div className="header__left">
          <Svg
            className="header__left__logo"
            src={Logo}
            alt={t('akt.component.header.logo.alt')}
          />
        </div>
        <div className="header__right">
          <ExtLink
            text="akt.component.header.ophLink.text"
            href="akt.component.header.ophLink.address"
            endIcon={<OpenInNewIcon />}
          />
          <LangSelector />
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
