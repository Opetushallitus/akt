import { FC } from 'react';
import { Box, AppBar, Toolbar, Typography, IconButton } from '@mui/material';

const Header: FC = () => {
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
            AKT
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
