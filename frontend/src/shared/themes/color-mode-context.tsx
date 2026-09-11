import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useMediaQuery } from '@mui/material'

export type ColorModePreference = 'light' | 'dark' | 'system'
export type ResolvedColorMode = 'light' | 'dark'

interface ColorModeContextValue {
  preference: ColorModePreference
  resolvedMode: ResolvedColorMode
  setPreference: (preference: ColorModePreference) => void
}

const STORAGE_KEY = 'softpago-color-mode'
const LEGACY_STORAGE_KEY = 'softpago-auth-color-mode'

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

function isColorModePreference(value: string | null): value is ColorModePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

/**
 * Reads persisted theme preference. Defaults to automatic (`system`).
 */
function readStoredPreference(): ColorModePreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isColorModePreference(stored)) {
      return stored
    }
    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY)
    if (isColorModePreference(legacy)) {
      window.localStorage.setItem(STORAGE_KEY, legacy)
      return legacy
    }
  } catch {
    // Ignore storage access errors in restricted contexts.
  }
  return 'system'
}

interface ColorModeProviderProps {
  children: ReactNode
}

/**
 * App-wide light/dark/system preference shared by auth and dashboard.
 */
export function ColorModeProvider({ children }: ColorModeProviderProps) {
  const [preference, setPreferenceState] = useState<ColorModePreference>(
    readStoredPreference,
  )
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)', {
    noSsr: true,
    defaultMatches:
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : false,
  })
  const resolvedMode: ResolvedColorMode =
    preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference

  const setPreference = useCallback((next: ColorModePreference) => {
    setPreferenceState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
      window.localStorage.setItem(LEGACY_STORAGE_KEY, next)
    } catch {
      // Ignore storage access errors in restricted contexts.
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = resolvedMode
    root.style.colorScheme = resolvedMode
  }, [resolvedMode])

  const value = useMemo(
    () => ({ preference, resolvedMode, setPreference }),
    [preference, resolvedMode, setPreference],
  )

  return (
    <ColorModeContext.Provider value={value}>{children}</ColorModeContext.Provider>
  )
}

/**
 * Reads the shared color-mode preference. Must be used under {@link ColorModeProvider}.
 */
export function useColorMode(): ColorModeContextValue {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within ColorModeProvider')
  }
  return context
}
