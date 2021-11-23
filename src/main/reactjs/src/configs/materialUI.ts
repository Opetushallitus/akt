import { createTheme } from '@mui/material/styles';

// Create Material UI theme configs
const primaryColor = '#FFFFFF';
const primaryLightColor = '#F5F5F5';
const primaryDarkColor = '#CCCCCC';
const secondaryColor = '#0A789C';
const secondaryLightColor = '#159ECB';
const secondaryDarkColor = '#00526C';
const primaryHeadingColor = '#2A2A2A';
const secondaryHeadingColor = '#FFFFFF';

const fontWeightBold = 700;
const fontWeightMedium = 500;
const fontWeightRegular = 400;

export const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
      light: primaryLightColor,
      dark: primaryDarkColor,
    },
    secondary: {
      main: secondaryColor,
      light: secondaryLightColor,
      dark: secondaryDarkColor,
    },
    text: {
      primary: primaryHeadingColor,
      secondary: secondaryHeadingColor,
    },
  },
  typography: {
    htmlFontSize: 10,
    h1: {
      fontSize: '2.8rem',
      fontWeight: fontWeightMedium,
      lineHeight: '3.3rem',
      marginBottom: '2rem',
      color: primaryHeadingColor,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: fontWeightMedium,
      lineHeight: '2.4rem',
      color: primaryHeadingColor,
    },
    h3: {
      fontSize: '1.6rem',
      fontWeight: fontWeightBold,
      lineHeight: '1.9rem',
      color: primaryHeadingColor,
    },
    body1: {
      fontSize: '1.6rem',
      fontWeight: fontWeightRegular,
      lineHeight: '2.4rem',
    },
  },
});
