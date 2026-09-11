import { createElement } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { createTheme, alpha, type Theme } from '@mui/material/styles'
import { AUTH_BRAND_TOKENS } from './auth-brand-tokens'

const CHECKBOX_SIZE_PX = 22
const CHECKBOX_BORDER_RADIUS_PX = 7
const CHECKBOX_CHECK_ICON_SIZE_PX = 16

export type AuthPaletteMode = 'light' | 'dark'

/**
 * Builds the auth MUI theme for light or dark using {@link AUTH_BRAND_TOKENS}.
 */
export function createAuthTheme(mode: AuthPaletteMode): Theme {
  const {
    primary,
    secondary,
    backgroundDark,
    backgroundLight,
    surfaceDark,
    surfaceLight,
    linkDark,
    linkLight,
    linkHover,
    linkHoverLight,
  } = AUTH_BRAND_TOKENS
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        contrastText: '#f7faf8',
      },
      secondary: {
        main: secondary,
        contrastText: primary,
      },
      background: {
        default: isDark ? backgroundDark : backgroundLight,
        paper: isDark ? surfaceDark : surfaceLight,
      },
      text: {
        primary: isDark ? '#f2f7f4' : primary,
        secondary: isDark ? alpha('#f2f7f4', 0.72) : alpha(primary, 0.72),
      },
      divider: isDark ? alpha(secondary, 0.16) : alpha(primary, 0.12),
      error: {
        main: isDark ? '#ff8a80' : '#c62828',
      },
      action: {
        hover: isDark ? alpha(secondary, 0.08) : alpha(primary, 0.04),
        selected: isDark ? alpha(secondary, 0.16) : alpha(primary, 0.08),
      },
    },
    typography: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      h4: {
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? backgroundDark : backgroundLight,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
        },
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              backgroundColor: isDark ? alpha('#ffffff', 0.04) : alpha(primary, 0.03),
              ...(isDark ? { color: '#f2f7f4' } : {}),
              '& input, & textarea': {
                ...(isDark ? { color: '#f2f7f4' } : {}),
              },
              '& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus, & input:-webkit-autofill:active, & textarea:-webkit-autofill, & textarea:-webkit-autofill:hover, & textarea:-webkit-autofill:focus, & textarea:-webkit-autofill:active':
                {
                  WebkitTextFillColor: isDark ? '#f2f7f4' : primary,
                  caretColor: isDark ? '#f2f7f4' : primary,
                  WebkitBoxShadow: `0 0 0 1000px ${isDark ? '#1e2220' : '#e8efe9'} inset`,
                  boxShadow: `0 0 0 1000px ${isDark ? '#1e2220' : '#e8efe9'} inset`,
                  transition: 'background-color 99999s ease-in-out 0s',
                },
              '& fieldset': {
                borderColor: isDark ? alpha(secondary, 0.22) : alpha(primary, 0.16),
              },
              '&:hover fieldset': {
                borderColor: isDark ? alpha(secondary, 0.4) : alpha(primary, 0.32),
              },
              '&.Mui-focused fieldset': {
                borderColor: secondary,
              },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: isDark
            ? {
                color: alpha('#f2f7f4', 0.72),
                '&.Mui-focused': {
                  color: secondary,
                },
                '&.MuiInputLabel-shrink': {
                  color: alpha('#f2f7f4', 0.9),
                },
                '&.MuiInputLabel-shrink.Mui-focused': {
                  color: secondary,
                },
                '&.Mui-error': {
                  color: '#ff8a80',
                },
              }
            : {
                color: alpha(primary, 0.72),
                '&.Mui-focused': {
                  color: primary,
                },
                '&.MuiInputLabel-shrink': {
                  color: alpha(primary, 0.85),
                },
                '&.MuiInputLabel-shrink.Mui-focused': {
                  color: primary,
                },
                '&.Mui-error': {
                  color: '#c62828',
                },
              },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: isDark
            ? {
                color: '#f2f7f4',
                '& input::placeholder, & textarea::placeholder': {
                  color: alpha('#f2f7f4', 0.55),
                  opacity: 1,
                },
              }
            : {
                '& input::placeholder, & textarea::placeholder': {
                  color: alpha(primary, 0.45),
                  opacity: 1,
                },
              },
          input: isDark ? { color: '#f2f7f4' } : {},
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: 10,
            minHeight: 44,
          },
        },
        variants: [
          {
            props: { variant: 'contained', color: 'primary' },
            style: {
              backgroundColor: isDark ? secondary : primary,
              color: isDark ? primary : '#f7faf8',
              boxShadow: isDark
                ? `0 4px 14px ${alpha(secondary, 0.2)}`
                : `0 4px 14px ${alpha(primary, 0.16)}`,
              '&:hover': {
                backgroundColor: isDark ? '#d4ff2e' : '#074039',
                boxShadow: isDark
                  ? `0 6px 18px ${alpha(secondary, 0.28)}`
                  : `0 6px 18px ${alpha(primary, 0.24)}`,
              },
            },
          },
        ],
      },
      MuiLink: {
        styleOverrides: {
          root: {
            color: isDark ? linkDark : linkLight,
            '&:hover': {
              color: isDark ? linkHover : linkHoverLight,
            },
          },
        },
      },
      MuiCheckbox: {
        defaultProps: {
          icon: createElement('span', {
            style: {
              width: CHECKBOX_SIZE_PX,
              height: CHECKBOX_SIZE_PX,
              borderRadius: CHECKBOX_BORDER_RADIUS_PX,
              border: `1.5px solid ${isDark ? alpha(secondary, 0.62) : alpha(primary, 0.42)}`,
              display: 'inline-flex',
              boxSizing: 'border-box',
              flexShrink: 0,
            },
          }),
          checkedIcon: createElement(
            'span',
            {
              style: {
                width: CHECKBOX_SIZE_PX,
                height: CHECKBOX_SIZE_PX,
                borderRadius: CHECKBOX_BORDER_RADIUS_PX,
                backgroundColor: secondary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
                flexShrink: 0,
              },
            },
            createElement(CheckIcon, {
              style: {
                fontSize: CHECKBOX_CHECK_ICON_SIZE_PX,
                color: primary,
              },
            }),
          ),
        },
        styleOverrides: {
          root: {
            padding: 9,
            borderRadius: CHECKBOX_BORDER_RADIUS_PX,
            color: isDark ? alpha(secondary, 0.62) : alpha(primary, 0.42),
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&.Mui-checked': {
              color: secondary,
            },
            '&.Mui-checked:hover': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
      MuiToggleButton: {
        styleOverrides: {
          root: {
            minWidth: 44,
            minHeight: 44,
            borderColor: isDark ? alpha(secondary, 0.22) : alpha(primary, 0.16),
            color: isDark ? alpha('#f2f7f4', 0.72) : alpha(primary, 0.72),
            '&.Mui-selected': {
              backgroundColor: isDark ? alpha(secondary, 0.18) : alpha(primary, 0.1),
              color: isDark ? secondary : primary,
              '&:hover': {
                backgroundColor: isDark ? alpha(secondary, 0.26) : alpha(primary, 0.14),
              },
            },
          },
        },
      },
    },
  })
}

/** Default light theme (Storybook / legacy imports). */
export const authTheme = createAuthTheme('light')
