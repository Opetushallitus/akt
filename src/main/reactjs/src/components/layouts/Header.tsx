import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
          ></IconButton>
          <Typography variant="h6" component="div">
            {t('header.title')}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
