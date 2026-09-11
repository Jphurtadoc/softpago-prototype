import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  shape: {
    borderRadius: 16,
  },

  palette: {
    mode: 'light',

    primary: {
      main: '#111827',
    },

    secondary: {
      main: '#6B7280',
    },

    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },

    text: {
      primary: '#111827',
      secondary: '#6B7280',
    },

    divider: '#E5E7EB',
  },

  typography: {
    fontFamily: ['Inter', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(
      ',',
    ),

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 700,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#F8FAFC',
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          boxShadow: '0 10px 35px rgba(15,23,42,.08)',
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          height: 52,
          borderRadius: 16,
          fontSize: '1rem',
          fontWeight: 600,
          textTransform: 'none',
        },

        contained: {
          backgroundColor: '#111827',

          '&:hover': {
            backgroundColor: '#1F2937',
          },
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          minHeight: 56,

          '& fieldset': {
            borderColor: '#E5E7EB',
          },

          '&:hover fieldset': {
            borderColor: '#CBD5E1',
          },

          '&.Mui-focused fieldset': {
            borderColor: '#111827',
            borderWidth: 2,
          },
        },
      },
    },
  },
});
