import { PanelLeftClose, Pin, PanelLeftOpen, type LucideIcon } from 'lucide-react'
import type { SidebarBehaviorPreference } from '@/shared/themes/sidebar-behavior-context'

/**
 * Shared Lucide icons for sidebar behavior selectors.
 */
export const SIDEBAR_BEHAVIOR_ICONS = {
  collapse: PanelLeftClose,
  fixed: Pin,
  automatic: PanelLeftOpen,
} as const satisfies Record<SidebarBehaviorPreference, LucideIcon>

export const SIDEBAR_BEHAVIOR_ICON_SIZE = 16
export const SIDEBAR_BEHAVIOR_ICON_STROKE = 1.75
