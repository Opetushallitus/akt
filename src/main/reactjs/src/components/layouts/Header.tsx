import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';

import { LangSelector } from 'components/i18n/LangSelector';

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
        <Typography className="header__title" variant="h6" component="div">
          {t('akt.header.title')}
        </Typography>
        <LangSelector />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
