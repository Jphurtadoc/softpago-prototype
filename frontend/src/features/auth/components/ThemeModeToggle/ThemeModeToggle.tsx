import { useRef, type KeyboardEvent, type MouseEvent } from 'react'
import { Box, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import {
  THEME_MODE_ICONS,
  THEME_MODE_ICON_SIZE,
  THEME_MODE_ICON_STROKE,
} from '@/shared/icons/theme-mode-icons'
import {
  useAuthColorMode,
  type AuthColorModePreference,
} from '../../themes/auth-color-mode-context'
import { AUTH_FLOATING_CONTROL_HEIGHT } from '../auth-floating-control'

/**
 * Filled segmented theme control — same visual language as the sidebar user menu.
 */
function ThemeModeToggle() {
  const { t } = useTranslation('common/theme')
  const theme = useTheme()
  const { preference, setPreference } = useAuthColorMode()
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
  const modeOptions: ReadonlyArray<{
    value: AuthColorModePreference
    label: string
    Icon: (typeof THEME_MODE_ICONS)[AuthColorModePreference]
  }> = [
    { value: 'light', label: t('light'), Icon: THEME_MODE_ICONS.light },
    { value: 'dark', label: t('dark'), Icon: THEME_MODE_ICONS.dark },
    { value: 'system', label: t('system'), Icon: THEME_MODE_ICONS.system },
  ]
  const selectedIndex = modeOptions.findIndex((option) => option.value === preference)
  const thumbIndex = selectedIndex >= 0 ? selectedIndex : 0
  const isDark = theme.palette.mode === 'dark'
  const primary = theme.palette.primary.main
  const secondary = theme.palette.secondary.main
  const borderColor = isDark
    ? alpha(secondary, 0.14)
    : alpha(primary, 0.08)
  const controlShadow = isDark
    ? `0 1px 4px ${alpha('#000000', 0.12)}`
    : `0 1px 3px ${alpha(primary, 0.04)}`
  const inactiveIcon = alpha(theme.palette.text.secondary, isDark ? 0.7 : 0.55)

  const handleSelect = (next: AuthColorModePreference, focusIndex?: number) => {
    setPreference(next)
    if (focusIndex === undefined) return
    buttonRefs.current[focusIndex]?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = thumbIndex
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault()
      const nextIndex = (current + 1) % modeOptions.length
      handleSelect(modeOptions[nextIndex].value, nextIndex)
      return
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault()
      const nextIndex = (current - 1 + modeOptions.length) % modeOptions.length
      handleSelect(modeOptions[nextIndex].value, nextIndex)
    }
  }

  return (
    <Box
      role="group"
      aria-label={t('groupLabel')}
      onKeyDown={handleKeyDown}
      sx={{
        position: 'relative',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        alignItems: 'center',
        height: AUTH_FLOATING_CONTROL_HEIGHT,
        width: 132,
        boxSizing: 'border-box',
        p: '2px',
        borderRadius: 999,
        border: '1px solid',
        borderColor,
        backgroundColor: 'background.paper',
        boxShadow: controlShadow,
      }}
    >

      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: 2,
          bottom: 2,
          left: 2,
          width: 'calc((100% - 4px) / 3)',
          borderRadius: 999,
          backgroundColor: secondary,
          boxShadow: `0 1px 2px ${alpha('#000000', 0.08)}`,
          transform: `translateX(${thumbIndex * 100}%)`,
          transition: 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
          },
        }}
      />
      {modeOptions.map(({ value, label, Icon }, index) => {
        const isSelected = preference === value
        return (
          <Box
            key={value}
            component="button"
            ref={(node: HTMLButtonElement | null) => {
              buttonRefs.current[index] = node
            }}
            type="button"
            aria-label={label}
            aria-pressed={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={(event: MouseEvent<HTMLButtonElement>) => {
              event.preventDefault()
              handleSelect(value, index)
            }}
            sx={{
              position: 'relative',
              zIndex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 32,
              m: 0,
              p: 0,
              border: 'none',
              borderRadius: 999,
              backgroundColor: 'transparent',
              color: isSelected ? primary : inactiveIcon,
              cursor: 'pointer',
              '&:hover': {
                color: isSelected
                  ? primary
                  : isDark
                    ? theme.palette.text.primary
                    : primary,
              },
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: secondary,
                outlineOffset: 1,
              },
            }}
          >
            <Icon
              size={THEME_MODE_ICON_SIZE}
              strokeWidth={THEME_MODE_ICON_STROKE}
              aria-hidden
            />
          </Box>
        )
      })}
    </Box>
  )
}

export default ThemeModeToggle
