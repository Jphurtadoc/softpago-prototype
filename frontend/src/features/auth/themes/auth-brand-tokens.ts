/**
 * SoftPago auth brand tokens — edit here to retheme the prototype.
 */
export const AUTH_BRAND_TOKENS = {
  /** Deep brand green (surfaces, primary actions in light). */
  primary: '#063832',
  /** Lime accent (CTAs in dark, highlights, brand mark). */
  secondary: '#caff05',
  /** Dark mode page background. */
  backgroundDark: '#0B140D',
  /** Dark mode elevated surface (cards, paper). */
  surfaceDark: '#121F16',
  /** High-contrast link color on dark backgrounds. */
  linkDark: '#D4FF33',
  /** Clearer green link color on light backgrounds. */
  linkLight: '#1B8A56',
  /** Link hover color on dark backgrounds. */
  linkHover: '#7EFF9A',
  /** Link hover color on light backgrounds. */
  linkHoverLight: '#0F6B42',
} as const

export type AuthBrandTokens = typeof AUTH_BRAND_TOKENS
