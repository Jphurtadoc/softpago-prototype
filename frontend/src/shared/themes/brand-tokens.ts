/**
 * SoftPago brand tokens — neutral gray surfaces, green brand, lime CTAs.
 *
 * Roles:
 * - primary: brand fill / ink on lime (`#1D4837`)
 * - secondary: buttons + small emphasis (`#D5F755`)
 * - surfaces: neutral gray ladder (no green tint)
 */
export const BRAND_TOKENS = {
  /** Deep forest green — brand chrome, ink on lime. */
  primary: '#1D4837',
  primaryRgb: '29, 72, 55',
  /** Mid green — hover on brand fills. */
  primaryMid: '#275C46',
  /** Lime — CTAs, toggles, badges, small emphasis. */
  secondary: '#D5F755',
  secondaryDark: '#B9D944',
  secondaryRgb: '213, 247, 85',
  /** Softer lime for charts / tertiary emphasis. */
  secondarySoft: '#E0FA8A',
  /** Text on brand-green fills. */
  onPrimary: '#F5F6F4',
  /** Titles and icons on light backgrounds. */
  ink: '#14161A',
  backgroundLight: '#F4F4F5',
  backgroundLightAlt: '#EAEAEC',
  /** App canvas (dark, neutral). */
  backgroundDark: '#121416',
  /** Elevated cards (dark). */
  surfaceDark: '#1A1C20',
  /** Nested / muted panels (dark). */
  surfaceDarkMuted: '#22252B',
  /** Sidebar / gradient end (dark). */
  surfaceDarkBottom: '#15171C',
  /** Sidebar gradient start (dark). */
  surfaceDarkChrome: '#1C1E24',
  surfaceLight: '#FFFFFF',
  surfaceMutedLight: '#EEEEF0',
  neutralTint: '#F0F0F2',
  autofillBgLight: '#EAEAEC',
  autofillTextLight: '#2C2E33',
  autofillBgDark: '#1A1C20',
  autofillTextDark: '#E8E8EA',
} as const

export type BrandTokens = typeof BRAND_TOKENS
