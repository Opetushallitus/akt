import { FC } from 'react';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';

const Footer: FC = () => {
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
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Footer;
