import { createTheme } from '@mui/material/styles';
import { BRAND_TOKENS } from '@/shared/themes/brand-tokens';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: BRAND_TOKENS.primary,
      contrastText: BRAND_TOKENS.onPrimary,
    },
    secondary: {
      main: BRAND_TOKENS.secondary,
      dark: BRAND_TOKENS.secondaryDark,
      contrastText: BRAND_TOKENS.primary,
    },
    background: {
      default: BRAND_TOKENS.backgroundLight,
      paper: '#ffffff',
    },
    text: {
      primary: BRAND_TOKENS.ink,
      secondary: '#6b7280',
    },
    error: {
      main: '#d9484c',
    },
  },
  typography: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    h1: { fontWeight: 700, letterSpacing: '-0.02em', color: BRAND_TOKENS.ink },
    h2: { fontWeight: 700, letterSpacing: '-0.02em', color: BRAND_TOKENS.ink },
    h3: { fontWeight: 700, letterSpacing: '-0.01em', color: BRAND_TOKENS.ink },
    h4: { fontWeight: 700, letterSpacing: '-0.01em', color: BRAND_TOKENS.ink },
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
          transition:
            'background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        },
        /** CTAs use lime (secondary), matching surface/button split in brand UI. */
        containedPrimary: {
          backgroundColor: BRAND_TOKENS.secondary,
          color: BRAND_TOKENS.primary,
          '&:hover': {
            backgroundColor: BRAND_TOKENS.secondaryDark,
            transform: 'translateY(-1px)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            '&:hover': {
              transform: 'none',
            },
          },
        },
        containedSecondary: {
          backgroundColor: BRAND_TOKENS.secondary,
          color: BRAND_TOKENS.primary,
          '&:hover': {
            backgroundColor: BRAND_TOKENS.secondaryDark,
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
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
});
