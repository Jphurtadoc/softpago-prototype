import { Monitor, Moon, Sun, type LucideIcon } from 'lucide-react'

/**
 * Shared Lucide icons for light / dark / system theme selectors.
 */
export const THEME_MODE_ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const satisfies Record<'light' | 'dark' | 'system', LucideIcon>

export const THEME_MODE_ICON_SIZE = 16
export const THEME_MODE_ICON_STROKE = 1.75
