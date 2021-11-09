import { createTheme } from '@mui/material/styles';

// Create Material UI theme configs
const primaryColor = '#0a789c';
const secondaryColor = '#ecc5c5';

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
});
