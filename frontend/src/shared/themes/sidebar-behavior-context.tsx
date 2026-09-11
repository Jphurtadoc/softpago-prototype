import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type SidebarBehaviorPreference = 'collapse' | 'fixed' | 'automatic'

interface SidebarBehaviorContextValue {
  preference: SidebarBehaviorPreference
  setPreference: (preference: SidebarBehaviorPreference) => void
}

const STORAGE_KEY = 'softpago-sidebar-behavior'

const SidebarBehaviorContext = createContext<SidebarBehaviorContextValue | null>(
  null,
)

function isSidebarBehaviorPreference(
  value: string | null,
): value is SidebarBehaviorPreference {
  return value === 'collapse' || value === 'fixed' || value === 'automatic'
}

/**
 * Reads persisted sidebar behavior. Defaults to automatic (hover expand).
 */
function readStoredPreference(): SidebarBehaviorPreference {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isSidebarBehaviorPreference(stored)) {
      return stored
    }
  } catch {
    // Ignore storage access errors in restricted contexts.
  }
  return 'automatic'
}

interface SidebarBehaviorProviderProps {
  children: ReactNode
}

/**
 * App-wide sidebar collapse / fixed / automatic preference.
 */
export function SidebarBehaviorProvider({
  children,
}: SidebarBehaviorProviderProps) {
  const [preference, setPreferenceState] = useState<SidebarBehaviorPreference>(
    readStoredPreference,
  )

  const setPreference = useCallback((next: SidebarBehaviorPreference) => {
    setPreferenceState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore storage access errors in restricted contexts.
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.sidebarBehavior = preference
  }, [preference])

  const value = useMemo(
    () => ({ preference, setPreference }),
    [preference, setPreference],
  )

  return (
    <SidebarBehaviorContext.Provider value={value}>
      {children}
    </SidebarBehaviorContext.Provider>
  )
}

/**
 * Reads the shared sidebar behavior preference.
 */
export function useSidebarBehavior(): SidebarBehaviorContextValue {
  const context = useContext(SidebarBehaviorContext)
  if (!context) {
    throw new Error(
      'useSidebarBehavior must be used within SidebarBehaviorProvider',
    )
  }
  return context
}
