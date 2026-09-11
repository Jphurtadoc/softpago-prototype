import { createTheme } from '@mui/material/styles';


export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#e3a052',
      contrastText: '#14161a',
    },
    secondary: {
      main: '#3fae7a',
      contrastText: '#ffffff',
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
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
  },
});