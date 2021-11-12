import { createTheme } from '@mui/material/styles';

// Create Material UI theme configs
const primaryColor = '#0a789c';
const secondaryColor = '#ecc5c5';
const headingColor = '#2a2a2a';

const fontWeightBold = 700;
const fontWeightMedium = 500;
const fontWeightRegular = 400;

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
  typography: {
    htmlFontSize: 10,
    h1: {
      fontSize: '2.8rem',
      fontWeight: fontWeightMedium,
      lineHeight: '3.3rem',
      color: headingColor,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: fontWeightMedium,
      lineHeight: '2.4rem',
      color: headingColor,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: fontWeightBold,
      lineHeight: '1.9rem',
      color: headingColor,
    },
    body1: {
      fontSize: '1.6rem',
      fontWeight: fontWeightRegular,
      lineHeight: '2.4rem',
    },
  },
});
