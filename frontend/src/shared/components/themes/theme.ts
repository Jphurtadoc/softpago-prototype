import { createTheme } from '@mui/material/styles';


export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#063832',
      contrastText: '#f7f5f1',
    },
    secondary: {
      main: '#caff05',
      dark: '#b8e800',
      contrastText: '#063832',
    },
    background: {
      default: '#faf8f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1c20',
      secondary: '#6b7280',
    },
    error: {
      main: '#d9484c',
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.02em' },
    h3: { fontWeight: 700, letterSpacing: '-0.01em' },
    h4: { fontWeight: 700, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
          transition: 'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        },
        containedSecondary: {
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '&:hover': {
              transform: 'none',
            },
          },
        },
      },
    },
  },
});