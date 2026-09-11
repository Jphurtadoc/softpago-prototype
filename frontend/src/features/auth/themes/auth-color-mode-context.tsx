import { useMemo, type ReactNode } from 'react'
import { CssBaseline, ThemeProvider } from '@mui/material'
import {
  useColorMode,
  type ColorModePreference,
} from '@/shared/themes/color-mode-context'
import { createAuthTheme } from './authTheme'

export type AuthColorModePreference = ColorModePreference

interface AuthThemeProviderProps {
  children: ReactNode
}

/**
 * Auth MUI ThemeProvider bound to the shared app color-mode preference.
 * Requires an ancestor {@link import('@/shared/themes/color-mode-context').ColorModeProvider}.
 */
export function AuthThemeProvider({ children }: AuthThemeProviderProps) {
  const { resolvedMode } = useColorMode()
  const theme = useMemo(() => createAuthTheme(resolvedMode), [resolvedMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  )
}

/**
 * Reads the shared color-mode preference (auth alias).
 * Must be used under ColorModeProvider.
 */
export { useColorMode as useAuthColorMode } from '@/shared/themes/color-mode-context'
