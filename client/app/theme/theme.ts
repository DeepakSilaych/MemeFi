import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { outfit, spaceGrotesk, inter } from '../styles/fonts';

// Create a base theme with custom typography
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00F6FF',
    },
    secondary: {
      main: '#00D1FF',
    },
    background: {
      default: '#0A0B0D',
      paper: 'rgba(255, 255, 255, 0.05)',
    },
  },
  typography: {
    fontFamily: `${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`,
    h1: {
      fontFamily: `${outfit.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: `${outfit.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 700,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontFamily: `${outfit.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: `${outfit.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 600,
    },
    h5: {
      fontFamily: `${outfit.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 500,
    },
    h6: {
      fontFamily: `${outfit.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 500,
    },
    subtitle1: {
      fontFamily: `${spaceGrotesk.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    subtitle2: {
      fontFamily: `${spaceGrotesk.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    body1: {
      fontFamily: `${inter.style.fontFamily}`,
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.7,
    },
    body2: {
      fontFamily: `${inter.style.fontFamily}`,
      fontWeight: 400,
      letterSpacing: '0.01em',
      lineHeight: 1.7,
    },
    button: {
      fontFamily: `${spaceGrotesk.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 500,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontFamily: `${inter.style.fontFamily}`,
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    overline: {
      fontFamily: `${spaceGrotesk.style.fontFamily}, ${inter.style.fontFamily}`,
      fontWeight: 500,
      letterSpacing: '0.05em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
  },
});

// Make typography responsive
const responsiveTheme = responsiveFontSizes(theme, {
  breakpoints: ['sm', 'md', 'lg'],
  factor: 2,
});

export default responsiveTheme;
