import { useId, useState, type MouseEvent } from 'react'
import { KeyboardArrowDown } from '@mui/icons-material'
import {
  Box,
  ButtonBase,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { supportedLocales, type AppLocale } from '@/dictionaries'
import {
  persistAppLocale,
  resolveAppLocale,
} from '@/shared/i18n/i18n'
import { AUTH_FLOATING_CONTROL_HEIGHT } from '../auth-floating-control'
import LocaleFlag from './LocaleFlag'

const LOCALE_INITIAL: Record<AppLocale, string> = {
  es: 'ES',
  en: 'EN',
  pt: 'PT',
}

export interface LocaleToggleProps {
  /** Menu opens above (auth floating) or below (settings). */
  readonly menuPlacement?: 'top' | 'bottom'
}

/**
 * Compact locale select: current flag + initial + chevron opens the menu.
 * Visual style follows shadcn Select trigger/menu patterns.
 * @see https://ui.shadcn.com/docs/components/radix/select
 */
function LocaleToggle({ menuPlacement = 'top' }: LocaleToggleProps) {
  const { t, i18n } = useTranslation('common/locale')
  const theme = useTheme()
  const menuId = useId()
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const isMenuOpen = Boolean(anchorEl)
  const opensUpward = menuPlacement === 'top'
  const currentLocale = resolveAppLocale(
    i18n.resolvedLanguage ?? i18n.language,
  )
  const isDark = theme.palette.mode === 'dark'
  const primary = theme.palette.primary.main
  const secondary = theme.palette.secondary.main
  const controlBorder = isDark
    ? alpha(secondary, 0.14)
    : alpha(primary, 0.08)
  const controlShadow = isDark
    ? `0 1px 4px ${alpha('#000000', 0.12)}`
    : `0 1px 3px ${alpha(primary, 0.04)}`
  const hoverFill = isDark
    ? theme.palette.grey[800]
    : alpha(primary, 0.1)
  const selectedFill = isDark
    ? theme.palette.grey[700]
    : theme.palette.grey[200]

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleSelect = (locale: AppLocale) => {
    void persistAppLocale(locale)
    handleClose()
  }

  return (
    <>
      <ButtonBase
        type="button"
        aria-label={t('groupLabel')}
        aria-haspopup="listbox"
        aria-expanded={isMenuOpen}
        aria-controls={isMenuOpen ? menuId : undefined}
        onClick={handleOpen}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.75,
          height: AUTH_FLOATING_CONTROL_HEIGHT,
          boxSizing: 'border-box',
          px: 1.25,
          borderRadius: 1.5,
          border: '1px solid',
          borderColor: controlBorder,
          backgroundColor: 'background.paper',
          color: 'text.primary',
          boxShadow: controlShadow,
          transition: 'background-color 150ms ease',
          '&:hover': {
            borderColor: controlBorder,
            backgroundColor: hoverFill,
            color: isDark ? 'text.primary' : primary,
          },
          '&:focus-visible': {
            outline: '2px solid',
            outlineColor: controlBorder,
            outlineOffset: 2,
          },
        }}
      >
        <LocaleFlag locale={currentLocale} />
        <Typography
          component="span"
          variant="body2"
          sx={{
            fontWeight: 600,
            letterSpacing: '0.02em',
            lineHeight: 1,
            minWidth: '1.4em',
          }}
        >
          {LOCALE_INITIAL[currentLocale]}
        </Typography>
        <KeyboardArrowDown
          sx={{
            fontSize: 18,
            color: 'text.secondary',
            transform: isMenuOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 150ms ease',
          }}
        />
      </ButtonBase>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleClose}
        anchorOrigin={{
          vertical: opensUpward ? 'top' : 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: opensUpward ? 'bottom' : 'top',
          horizontal: 'left',
        }}
        slotProps={{
          list: {
            'aria-label': t('groupLabel'),
            role: 'listbox',
            dense: true,
            sx: { py: 0.5 },
          },
          paper: {
            elevation: 0,
            sx: {
              mt: opensUpward ? -0.75 : 0.75,
              minWidth: 168,
              borderRadius: 1.5,
              border: '1px solid',
              borderColor: controlBorder,
              backgroundColor: 'background.paper',
              boxShadow: isDark
                ? `0 8px 24px ${alpha('#000000', 0.4)}`
                : `0 8px 24px ${alpha('#000000', 0.1)}`,
            },
          },
        }}
      >
        {supportedLocales.map((locale) => {
          const isSelected = locale === currentLocale
          return (
            <MenuItem
              key={locale}
              selected={isSelected}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(locale)}
              sx={{
                gap: 1.25,
                mx: 0.5,
                minHeight: 40,
                borderRadius: 1,
                '&.Mui-selected': {
                  backgroundColor: selectedFill,
                },
                '&:hover': {
                  backgroundColor: hoverFill,
                },
                '&.Mui-selected:hover': {
                  backgroundColor: selectedFill,
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocaleFlag locale={locale} />
              </Box>
              <Typography
                variant="body2"
                sx={{ fontWeight: isSelected ? 600 : 500 }}
              >
                {t(locale)}
              </Typography>
            </MenuItem>
          )
        })}
      </Menu>
    </>
  )
}

export default LocaleToggle
